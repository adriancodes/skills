# B-tree database indexes

Most database “B-tree” indexes are actually **B+ trees**: internal pages guide the search, while leaf pages contain every indexed key and are linked in sorted order. This design makes equality lookups, range scans, sorting, and prefix queries efficient while keeping tree height small.

## 1. Structure

A B-tree index is divided into fixed-size blocks called **pages**—commonly 4–16 KB, depending on the database. Each page usually corresponds to one storage block and can hold many entries.

The tree has three page types:

```text
                    Root page
                 [30 | 60 | 90]
                /     |     |    \
               /      |     |     \
       Internal    Internal ...   Internal
          pages       pages         pages
             \          |           /
              \         |          /
        Leaf pages in sorted key order
 [1..10] <-> [11..20] <-> [21..30] <-> ...
```

### Root page

The root is the entry point. It stores separator keys and pointers to child pages.

For example:

```text
[30 | 60]
```

might mean:

- Follow child 1 for keys below 30.
- Follow child 2 for keys from 30 through 59.
- Follow child 3 for keys 60 or above.

The exact boundary convention varies by implementation.

### Internal pages

Internal pages contain:

- Separator keys.
- Child-page pointers.
- Sometimes compressed or abbreviated versions of keys.

They generally do **not** contain the table rows. Their job is routing.

### Leaf pages

Leaf pages contain sorted index entries. Depending on the database and index type, an entry may contain:

- The indexed key and a row identifier.
- The indexed key and primary key.
- The entire table row, in a clustered index.
- Extra included columns for an index-only scan.

Leaf pages are usually connected with next/previous pointers. Once the database finds the first matching leaf entry, it can scan neighboring entries without returning to the root.

## 2. Why the tree stays shallow

Each internal page can point to many children. This number is the tree’s **fan-out**.

Suppose an internal page holds 500 child pointers:

- Height 1: 500 leaf pages.
- Height 2: 250,000 leaf pages.
- Height 3: 125 million leaf pages.

Consequently, even a very large index may require only three or four page traversals from root to leaf. Frequently accessed upper pages are also likely to remain in the buffer cache, so many lookups require only one actual storage read—or none.

The approximate lookup complexity is:

```text
O(log_f N)
```

where `f` is the fan-out. Because `f` is large, this is much shallower than a binary search tree.

## 3. Equality lookup path

Consider an index on `users(email)` and this query:

```sql
SELECT *
FROM users
WHERE email = 'sam@example.com';
```

The database proceeds roughly as follows:

1. Read the root page.
2. Compare the search key with the root’s separator keys.
3. Choose one child pointer.
4. Repeat on any internal pages.
5. Reach the leaf page that could contain the key.
6. Search within that page, often using binary search.
7. If found, use the stored row locator to fetch the table row.

The last step depends on the index organization.

### Clustered index

In a clustered index, the leaf level contains the table rows themselves. Reaching the leaf may therefore complete the lookup.

Examples include an InnoDB primary-key index and SQL Server clustered indexes.

### Secondary or nonclustered index

A secondary index normally points elsewhere:

```text
secondary index lookup
        ↓
(primary key or row ID)
        ↓
table/clustered-index lookup
```

This second traversal is sometimes called a **bookmark lookup**, **key lookup**, or **heap fetch**. If the query returns many rows, these scattered lookups can dominate its cost.

### Covering index

If the index contains every column needed by the query, the database may avoid reading the table:

```sql
CREATE INDEX users_email_cover
ON users(email)
INCLUDE (display_name);
```

A query selecting only `email` and `display_name` may then use an **index-only scan**. Some engines still consult visibility metadata to determine whether the indexed version is visible to the current transaction.

## 4. Range lookup path

B+ trees are especially useful for ranges:

```sql
SELECT *
FROM orders
WHERE created_at >= '2026-01-01'
  AND created_at <  '2026-02-01'
ORDER BY created_at;
```

The database:

1. Traverses from the root to the first qualifying leaf entry.
2. Reads forward through that leaf page.
3. Follows the next-leaf pointer.
4. Stops when it reaches the upper bound.

Conceptually:

```text
               descend once
                    ↓
[...] <-> [2025-12] <-> [2026-01] <-> [2026-02] <-> [...]
                         └── scan ──┘
```

The cost is approximately:

```text
O(log N + K)
```

where `K` is the number of entries scanned.

Because leaf entries are sorted, the same structure can often support:

- `<`, `<=`, `>`, and `>=`.
- `BETWEEN`.
- Ordered output.
- `MIN` and `MAX`.
- Prefix matching such as `LIKE 'sam%'`.
- Forward or backward scans.
- Grouping or merging when index order is compatible.

It generally cannot efficiently seek on a leading wildcard such as:

```sql
WHERE name LIKE '%sam'
```

because the beginning of the key is unknown.

## 5. Composite indexes

For an index on:

```sql
CREATE INDEX orders_customer_date
ON orders(customer_id, created_at);
```

entries are ordered lexicographically:

```text
(customer_id, created_at)
```

That means they are first grouped by `customer_id`, then ordered by `created_at` within each customer.

The index efficiently supports:

```sql
WHERE customer_id = 42
```

and:

```sql
WHERE customer_id = 42
  AND created_at >= ...
```

It is usually much less effective for:

```sql
WHERE created_at >= ...
```

because dates for different customers are interleaved by the leading column.

This is the basis of the **leftmost-prefix rule**. Once a broad range is used on one column, columns after it often cannot narrow the tree traversal, though they may still be checked inside the index.

For example:

```sql
WHERE customer_id = 42
  AND created_at > '2026-01-01'
  AND status = 'paid'
```

With an index on `(customer_id, created_at, status)`, the first two conditions locate a range. `status` may filter index entries, but it usually cannot form one contiguous seek range because many status values can occur throughout the date range.

## 6. Insertion

To insert a new entry, the database:

1. Traverses the tree to the correct leaf page.
2. Places the entry in sorted position.
3. Updates transaction logs and page metadata.
4. Splits the page if there is insufficient free space.

If the target page has room, the operation is local. Entries may need to shift within the page, but the tree structure remains unchanged.

## 7. Leaf-page splits

Suppose a leaf page is full:

```text
[10, 20, 30, 40]
```

and the database must insert `25`.

The engine allocates another leaf page and redistributes the entries:

```text
Before:

Parent → [10, 20, 30, 40]

After:

Parent → [10, 20] <-> [25, 30, 40]
                    ↑
             new separator
```

The parent receives a separator key and a pointer to the new page.

A split involves more than moving entries. The engine may also need to:

- Allocate and initialize a page.
- Update sibling links.
- Modify the parent.
- Generate write-ahead log records.
- Coordinate concurrent readers and writers.
- Eventually write multiple dirty pages to storage.

This is why a split is more expensive than an insertion into a page with free space.

The entries are not necessarily divided exactly in half. Some engines choose a split point based on insertion direction, duplicate keys, page policy, or expected future growth.

## 8. Internal-page splits

The new separator inserted into the parent can make the parent overflow. The parent must then split too, and a separator is inserted into its parent.

This can cascade upward:

```text
leaf split
   ↓
parent split
   ↓
grandparent split
   ↓
root split
```

If the root splits, the database creates a new root pointing to the two resulting pages:

```text
Before:

       [full root]

After:

        [separator]       ← new root
        /         \
 [left page]   [right page]
```

A root split increases the tree’s height by one. Tree height changes are rare compared with ordinary leaf insertions.

Deletion performs the reverse logical operation. Pages may be merged or redistributed when they become sparse, although databases differ considerably: some eagerly rebalance, while others tolerate empty space and reclaim it later through maintenance.

## 9. Sequential versus random inserts

The indexed key strongly affects write behavior.

### Sequential keys

With an increasing key such as an identity column, inserts mostly target the rightmost leaf page:

```text
[...] <-> [980, 981, 982, 983] ← new inserts
```

Advantages include:

- Good locality.
- Predictable access.
- Fewer widely scattered dirty pages.
- Often fewer fragmented pages.

The disadvantage is contention: many concurrent sessions may compete for the same rightmost page. Some engines include optimizations for this hotspot.

### Random keys

Random UUIDs distribute inserts across the tree.

Potential effects include:

- More pages touched in memory.
- More cache misses.
- Splits throughout the index.
- Less sequential storage access.
- Greater fragmentation.
- Lower hotspot contention in some workloads.

Time-ordered UUID variants can improve locality, though their exact ordering and database encoding matter.

## 10. Fill factor

A **fill factor** controls how full index pages should be when an index is built or rebuilt.

For example, a fill factor of 80% intentionally reserves about 20% free space:

```text
[entries........][free space]
```

This can reduce near-term page splits for random inserts. The cost is a larger index:

- More pages must be cached.
- Range scans read more pages.
- Tree height may increase sooner.
- Storage use rises.

Fill factor is not permanent protection. Continued inserts eventually consume the reserved space. Its exact meaning and whether it applies to leaf or internal pages are engine-specific.

## 11. Updates and deletes

Updating an indexed column often behaves like deleting the old index entry and inserting a new one:

```sql
UPDATE users
SET email = 'new@example.com'
WHERE id = 42;
```

If `email` is indexed, its entry may move to a completely different leaf page.

Updating a non-indexed column may still modify an index when:

- The index is clustered and stores the entire row.
- The column is included in a covering index.
- The row’s physical locator changes.
- The engine creates a new row version for MVCC.

Deletes generally mark or remove an index entry, but physical cleanup may be delayed. MVCC databases often retain dead row versions until a vacuum or garbage-collection process can safely reclaim them.

## 12. The central read/write trade-off

The main trade-off is simple:

> More indexes make selected reads faster, but make writes and storage maintenance more expensive.

An index can transform a full-table scan into a short tree traversal:

```text
Without index: inspect many or all rows
With index:    root → internal page → leaf → matching rows
```

But every relevant write must maintain the index.

For each `INSERT`, the engine may need to:

- Insert into every applicable index.
- Dirty several pages.
- Perform page splits.
- Produce more transaction-log data.
- Hold additional latches or locks.
- Write more data to storage.

For an `UPDATE`, every index containing a changed column may require modification. A `DELETE` must eventually remove the row from every index.

Indexes also consume buffer-cache space. Ten indexes do not merely occupy disk: their frequently accessed pages compete with table data and other indexes for memory.

Therefore, the right goal is not “index every searchable column.” It is to create the smallest set of indexes that supports important query patterns.

## 13. Why the optimizer may ignore an index

Having an applicable index does not guarantee that it is cheaper than scanning the table.

Suppose this query returns 70% of the rows:

```sql
SELECT *
FROM users
WHERE active = true;
```

Using an index may require:

1. Reading much of the index.
2. Following thousands of row locators.
3. Reading table pages in a scattered order.

A sequential table scan may be cheaper.

The optimizer estimates this using statistics such as:

- Row count.
- Number of distinct values.
- Value distribution.
- Null fraction.
- Correlation between index order and physical row order.
- Expected number of matching rows.

An index on a low-cardinality column such as a boolean is not automatically useless. It may help when one value is rare, when combined with other columns, when filtered or partial, or when it covers the query.

## 14. Key width matters

Wider keys reduce how many entries fit on each page. This lowers fan-out and increases the number of pages required.

A wide index can cause:

- A larger tree.
- More cache pressure.
- More I/O during scans.
- More bytes moved during splits.
- More transaction-log traffic.

This matters especially when secondary indexes store the table’s primary key as their row locator. In such systems, a wide primary key makes every secondary index wider too.

Included columns also enlarge leaf entries even if they are absent from internal routing keys. Covering an important query may justify that cost, but covering every possible query usually does not.

## 15. Concurrency and crash safety

Databases must modify a B-tree while other transactions are searching it. They usually use short-lived internal synchronization—often called **latches**—to protect page structures.

These are distinct from transactional row or key locks:

- A latch protects an in-memory data structure during a brief operation.
- A transaction lock protects logical data and may last until commit.

During a split, the engine must ensure that concurrent searches can still reach the correct page even while links and parent separators are changing. Implementations use carefully ordered latch protocols, sibling links, version checks, or specialized concurrent B-tree algorithms.

Structural changes are also recorded in a write-ahead log. After a crash, recovery can restore the tree to a consistent state even if only some modified pages reached storage.

## 16. Practical mental model

Think of a B+ tree as a sorted directory arranged in page-sized levels:

```text
Root and internal pages:
    “Which page could contain this key?”

Leaf pages:
    “Here are the keys, in order.”

Row locator:
    “Here is where the corresponding row can be found.”
```

An equality lookup descends one path. A range lookup descends once and then walks adjacent leaves. Inserts modify a leaf and occasionally split pages upward. The structure buys fast, ordered reads at the cost of storage, cache use, and extra work on every indexed write.
