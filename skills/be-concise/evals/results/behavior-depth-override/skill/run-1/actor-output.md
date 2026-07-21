# B-tree database indexes

A B-tree index is a sorted, balanced tree that lets a database find rows without scanning the entire table. “Balanced” means every path from the root to a leaf has roughly the same length, so lookup cost grows logarithmically as the index grows.

Most databases actually use a **B+ tree**, commonly called a B-tree:

- Internal pages contain separator keys and child-page pointers.
- Leaf pages contain all indexed keys and row references.
- Leaf pages are linked in sorted order, making range scans efficient.

## 1. The structure

Suppose we create:

```sql
CREATE INDEX users_email_idx ON users(email);
```

Conceptually, the index might look like this:

```text
                         Root page
                   [m@example.com]
                    /             \
                   /               \
        Internal page             Internal page
      [d@..., h@...]            [r@..., w@...]
        /    |    \               /    |    \
      leaf leaf  leaf           leaf  leaf  leaf
```

Each node is normally one fixed-size database page, often 8 or 16 KiB. A page contains many keys, not just one. This high branching factor—often hundreds of children per internal page—is why even enormous indexes remain shallow.

A typical index with millions of entries may need only three or four page reads:

```text
root → internal page → leaf page
```

### Internal pages

An internal page stores entries resembling:

```text
separator key → child page
```

The separator keys divide the key space. For example:

```text
child 1: keys less than 100
child 2: keys from 100 through 499
child 3: keys 500 and above
```

The exact boundary representation depends on the database. Some systems shorten separator keys when a full value is unnecessary.

### Leaf pages

Leaf pages store sorted index entries such as:

```text
("alice@example.com", row reference)
("bob@example.com",   row reference)
("carol@example.com", row reference)
```

The row reference may be:

- A physical tuple location, as in PostgreSQL.
- The table’s primary key, as in InnoDB secondary indexes.
- The complete row itself when the index is clustered or index-organized.
- Included columns needed for an index-only or covering scan.

Leaf pages are usually connected:

```text
leaf 1 ↔ leaf 2 ↔ leaf 3 ↔ leaf 4
```

Once the database reaches the first matching leaf, it can scan neighboring leaves sequentially. That is what makes queries such as this efficient:

```sql
SELECT *
FROM orders
WHERE created_at >= '2026-01-01'
  AND created_at <  '2026-02-01'
ORDER BY created_at;
```

## 2. How a lookup travels through the tree

Consider an index on integer keys:

```text
Root: [100 | 500]
```

Its pointers represent these ranges:

```text
pointer 1: key < 100
pointer 2: 100 <= key < 500
pointer 3: key >= 500
```

To find key `420`, the database:

1. Reads or locates the root page.
2. Searches the root’s sorted separator keys.
3. Chooses the child covering `100 <= key < 500`.
4. Repeats that process on any intermediate page.
5. Reaches a leaf and searches within it for `420`.
6. Uses the leaf entry’s row reference to fetch the table row, unless the index already contains everything the query needs.

Within a page, the database can use binary search, a page-specific search structure, or a specialized optimized routine. The important point is that it eliminates whole subtrees at every level.

If each internal page points to 300 children, a three-level tree can address approximately:

```text
300 × 300 × 300 = 27,000,000
```

leaf regions. Exact capacity varies with key size, page size, compression, and page metadata.

### Cached versus physical reads

The root and upper internal pages are accessed frequently, so they are usually already in memory. A real lookup might therefore require only one uncached leaf-page read, followed by a table-page read.

This distinction matters: the theoretical tree depth may be four pages, but not all four normally require storage I/O.

### Fetching the row

Finding the index entry is not always the end of the lookup. In a non-covering secondary index, the database must perform another lookup to obtain the table row:

```text
B-tree lookup → row reference → table-page lookup
```

This is sometimes called a bookmark lookup, heap fetch, or table lookup.

For many scattered results, those extra reads can dominate the cost. That is why an optimizer may prefer a table scan when a predicate matches a large fraction of the table.

### Index-only scans

If the index contains every column required by the query, the engine may avoid fetching the table row:

```sql
CREATE INDEX orders_customer_idx
    ON orders(customer_id)
    INCLUDE (status, total);
```

A query needing only `customer_id`, `status`, and `total` may be answerable directly from the index. Whether that is possible also depends on the database’s visibility and concurrency rules.

## 3. Equality, range, and ordered scans

B-trees support more than equality lookups.

### Equality

```sql
WHERE email = 'alice@example.com'
```

The database follows one root-to-leaf path and checks the matching leaf entries.

### Range

```sql
WHERE price BETWEEN 100 AND 200
```

The engine finds the first key at or above `100`, then walks forward through the linked leaves until it passes `200`.

The cost is approximately:

```text
tree descent + matching leaf pages + required row fetches
```

### Ordering

Because leaf entries are sorted, an index may satisfy:

```sql
ORDER BY price
```

without a separate sort. It can often scan backward for descending order as well.

### Prefix behavior for composite indexes

For an index on:

```sql
CREATE INDEX events_idx ON events(account_id, created_at);
```

entries are ordered first by `account_id`, then by `created_at` within each account:

```text
(account 1, time 1)
(account 1, time 2)
(account 2, time 1)
(account 2, time 2)
```

This works especially well for:

```sql
WHERE account_id = 42
  AND created_at >= ...
```

It is usually less useful for a query filtering only on `created_at`, because times belonging to different accounts are not globally adjacent. This is the **leftmost-prefix** principle: the leading columns determine how the tree is partitioned and ordered.

## 4. Inserting an entry

To insert a new indexed value, the database:

1. Traverses from the root to the correct leaf.
2. Finds the entry’s sorted position.
3. Inserts the key and row reference.
4. Records the change in its transaction log.
5. Updates concurrency and recovery metadata as required.

If the leaf has enough free space, insertion is local. The engine modifies that leaf page, marks it dirty in memory, and eventually writes it back to storage.

Indexes frequently reserve some free space in pages so future inserts do not immediately require structural changes. PostgreSQL calls the corresponding configuration concept `fillfactor`; other databases have similar controls.

## 5. Page splits

A page split occurs when a new entry must be inserted into a full page.

Suppose a leaf can hold four keys:

```text
[10, 20, 30, 40]
```

Now insert `25`. The logical result does not fit:

```text
[10, 20, 25, 30, 40]
```

The database allocates another leaf and divides the entries:

```text
old leaf: [10, 20]
new leaf: [25, 30, 40]
```

It updates the sibling links:

```text
previous ↔ old leaf ↔ new leaf ↔ next
```

Then it inserts a separator and child pointer into the parent so future searches can reach the new page:

```text
parent: [... | 25 | ...]
```

The separator does not necessarily duplicate the full first key exactly; implementations may use a shortened boundary key.

### Split propagation

If the parent is also full, adding the new separator can split the parent. That may continue upward:

```text
leaf split
   ↓
parent split
   ↓
grandparent split
```

If the root splits, the database creates a new root pointing to the two resulting pages. The tree’s height then increases by one.

Root splits are rare because each extra level multiplies the tree’s capacity.

### Why splits are expensive

A split may require:

- Allocating a new page.
- Moving many index entries.
- Modifying the original page.
- Updating sibling links.
- Updating a parent page.
- Writing additional transaction-log records.
- Holding page latches while the structure changes.
- Producing more dirty pages that must later be flushed.
- Temporarily increasing contention among concurrent writers.

Database engines use carefully designed latch protocols and recovery algorithms so concurrent searches do not follow inconsistent pointers and crash recovery can replay an interrupted split safely.

### Sequential versus random inserts

Inserting increasing values, such as timestamps or sequential IDs, usually targets the rightmost leaf:

```text
... → [900, 901, 902, 903]
```

Advantages include locality and fewer scattered page modifications. The drawback is that many concurrent writers may contend for the same rightmost pages.

Random values, such as uniformly random UUIDs, distribute writes across the tree. This may reduce one hot spot, but it tends to:

- Touch more pages.
- Cause splits throughout the index.
- Reduce cache locality.
- Leave pages less densely packed.
- Increase index size and write amplification.

The actual result depends on the engine, workload, key width, and UUID scheme. Time-ordered UUID variants can improve locality, though they may reintroduce a right-edge hot spot.

### Split versus redistribution

Some engines can redistribute entries between neighboring pages or apply other optimizations before splitting. The basic B-tree model still treats splitting as the standard response when a node cannot accommodate another entry.

## 6. Updates and deletes

### Updating an indexed column

Changing an indexed key is logically similar to:

```text
delete old index entry
insert new index entry
```

That means an update which changes indexed columns may traverse the tree, dirty several pages, and possibly trigger a split.

Even when the key itself is unchanged, a database may need index-related work because of its row-versioning or storage design. PostgreSQL’s MVCC implementation, for example, affects whether an update can avoid creating new index entries.

### Deleting a row

Deleting a row removes or invalidates its index entries. Engines often do not immediately merge or rebalance pages after every deletion because that would create excessive write work.

Instead, they may:

- Mark entries as deleted.
- Reclaim space later.
- Clean pages during vacuuming or background maintenance.
- Merge underfull pages only when worthwhile.
- Leave some fragmentation until the index is rebuilt or reorganized.

A B-tree therefore remains logically balanced even if its physical pages are not perfectly full.

## 7. The main read/write trade-off

The central trade-off is simple: **an index makes selected reads faster by making writes and storage more expensive.**

Without an index, finding a small number of rows may require scanning every table page:

```text
read cost ≈ entire table
```

With a useful B-tree index:

```text
read cost ≈ a few tree pages + matching entries + row fetches
```

However, every insert, delete, or relevant update must maintain the index. If a table has five indexes, inserting one row may require one table write plus changes to all five index structures.

### Read benefits

A suitable B-tree can improve:

- Equality predicates.
- Range predicates.
- Prefix searches such as `LIKE 'abc%'`, subject to collation and operator rules.
- Ordered retrieval.
- `MIN` and `MAX`.
- Joins on indexed keys.
- Uniqueness checks.
- Index-only queries.

### Write costs

Each additional index increases:

- Insert work.
- Delete work.
- Updates that affect indexed data.
- Transaction-log or redo generation.
- Dirty-page flushing.
- Lock or latch contention.
- Storage use.
- Cache consumption.
- Maintenance and backup volume.

Wide keys amplify these costs. A larger entry means fewer entries per page, a lower branching factor, more leaf pages, and potentially a deeper or less cache-friendly tree.

### Selectivity matters

An index is most valuable when it narrows the query to a relatively small portion of the table.

For:

```sql
WHERE id = 123
```

a unique index is ideal.

For:

```sql
WHERE active = true
```

an index may be unattractive if 95% of rows are active. The engine might have to traverse much of the index and then fetch rows from many scattered table pages. Reading the table sequentially can be cheaper.

An index on a low-cardinality column can still be useful when:

- One value is rare.
- A partial or filtered index contains only the interesting rows.
- The index covers the query.
- The column is useful as part of a composite index.
- Rows are physically clustered in a favorable way.

## 8. Clustered and nonclustered organization

The term “clustered index” varies by database, but the main distinction is where the table data lives.

### Clustered or index-organized storage

The table rows are stored in primary-key order at the B-tree leaves. Reaching a leaf reaches the row itself.

Benefits include:

- No separate heap lookup for primary-key reads.
- Good locality for primary-key ranges.

Costs include:

- Primary-key changes can be expensive.
- Random primary keys create fragmented writes.
- Secondary indexes may need to store the primary key as their row locator.

InnoDB tables are organized this way around the primary key.

### Heap plus secondary indexes

The table is stored separately without being permanently ordered by the index. Leaf entries point to table tuples.

Benefits include independence between table placement and index order. The cost is that a lookup may require one traversal followed by a separate heap-page fetch.

PostgreSQL generally follows this model.

## 9. Complexity versus actual performance

Textbook costs are often described as:

- Lookup: `O(log n)`
- Insert: `O(log n)`
- Delete: `O(log n)`
- Range scan: `O(log n + k)`, where `k` is the number of returned entries

Those bounds are correct but incomplete for databases. The constants depend heavily on:

- Tree height.
- Page size.
- Key width.
- Cache hit rate.
- Storage latency.
- Number and locality of table-row fetches.
- Concurrency.
- Transaction logging.
- Split frequency.
- Whether pages are already dirty.
- Whether the scan is sequential or random.

Because the branching factor is high, `log n` is usually a very small number. In practice, cache behavior and row-fetch locality often matter more than a one-level difference in tree height.

## 10. A complete example

Assume this table:

```sql
CREATE TABLE orders (
    id          bigint PRIMARY KEY,
    customer_id bigint NOT NULL,
    created_at  timestamp NOT NULL,
    status      text NOT NULL,
    total       numeric NOT NULL
);

CREATE INDEX orders_customer_time_idx
    ON orders(customer_id, created_at);
```

Now execute:

```sql
SELECT id, status, total
FROM orders
WHERE customer_id = 42
  AND created_at >= '2026-06-01'
  AND created_at <  '2026-07-01'
ORDER BY created_at;
```

The engine can:

1. Traverse the index using the composite key `(42, '2026-06-01')`.
2. Reach the first leaf entry at or after that value.
3. Walk forward through the linked leaf pages.
4. Stop when the customer changes or the timestamp reaches July.
5. Follow each entry’s row reference to retrieve `id`, `status`, and `total`.
6. Return rows already ordered by `created_at`, avoiding an explicit sort.

If the index includes the selected columns:

```sql
CREATE INDEX orders_customer_time_covering_idx
    ON orders(customer_id, created_at)
    INCLUDE (id, status, total);
```

the engine may answer from the index alone. Reads can become faster, but the index becomes wider, occupies more pages, uses more cache, and costs more to maintain.

That example captures the entire bargain: B-trees spend storage and write work to maintain a sorted structure so targeted and ordered reads can avoid examining most of the table.
