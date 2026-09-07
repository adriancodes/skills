# B-tree indexes, step by step

A B-tree index is a balanced, sorted data structure that databases use to find rows without scanning an entire table.

Despite the name, most database indexes are technically **B+ trees**, a close variant of B-trees. Database documentation often calls them simply “B-tree indexes,” so I’ll do the same.

## 1. The problem an index solves

Suppose we have this table:

```sql
CREATE TABLE customers (
    id         BIGINT PRIMARY KEY,
    last_name  VARCHAR(100),
    email      VARCHAR(255),
    created_at TIMESTAMP
);
```

It contains 10 million rows.

Without an index, this query may require checking every row:

```sql
SELECT *
FROM customers
WHERE email = 'maya@example.com';
```

Conceptually:

```text
row 1      compare email
row 2      compare email
row 3      compare email
...
row 10M    compare email
```

That is a **full table scan**, with work proportional to the table size: roughly \(O(n)\).

Now create an index:

```sql
CREATE INDEX customers_email_idx
ON customers (email);
```

The database builds a separate, ordered structure containing entries like:

```text
email                         row locator
------------------------------------------------
aaron@example.com             → row 8,721
abigail@example.com           → row 91
...
maya@example.com              → row 7,381,004
...
zoe@example.com               → row 442
```

Because the entries are ordered, the database can avoid examining nearly all of them.

---

## 2. Why not just use a sorted array?

A sorted array supports fast binary search:

```text
[3, 8, 12, 17, 24, 31, 46, 57, 68, 72]
```

Finding `46` takes only a few comparisons.

But inserting `20` is expensive:

```text
Before:
[3, 8, 12, 17, 24, 31, 46, 57, 68, 72]

After:
[3, 8, 12, 17, 20, 24, 31, 46, 57, 68, 72]
```

Everything after the insertion point may need to move.

A binary search tree makes insertion easier, but it has two problems for database storage:

1. It can become unbalanced.
2. Each node typically has only two children, producing a tall tree and many storage-page reads.

A B-tree addresses both problems:

- It remains balanced.
- Each node contains many keys and many child pointers.
- Its height remains very small.
- Its nodes are sized to fit database pages efficiently.

---

## 3. The basic structure

A simplified B+ tree might look like this:

```text
                         [ 30 | 60 ]
                        /     |      \
                       /      |       \
       [5, 10, 20, 25]  [30, 35, 45, 55]  [60, 70, 80, 90]
```

The top node is the **root**.

The bottom nodes are **leaf nodes**.

The values in an internal node divide the search space:

- Left child: values below `30`
- Middle child: values from `30` through values below `60`
- Right child: values at least `60`

Real trees can have additional levels:

```text
Root
  └── Internal nodes
        └── More internal nodes
              └── Leaf nodes
```

Three important properties hold:

1. Keys are sorted within every node.
2. All leaves are at the same depth.
3. A node can have many children, often hundreds.

The second property makes the tree balanced: no key is hidden in a much deeper branch than another.

---

## 4. Nodes and database pages

Databases read and write storage in fixed-size blocks called **pages**. A page might be 8 KiB or 16 KiB, depending on the database.

A B-tree node is usually stored in one page.

Suppose an internal-page entry needs:

- 16 bytes for a key
- 8 bytes for a child-page pointer
- some additional page overhead

An 8 KiB page may hold hundreds of entries.

If each internal node has 300 children, then a tree with three branching levels can address approximately:

\[
300^3 = 27,000,000
\]

leaf regions.

This is the main reason B-trees are effective: their **branching factor** is enormous. Even an index containing millions or billions of entries may be only a few levels deep.

---

## 5. What leaf entries contain

Internal nodes mostly guide navigation. Leaf nodes contain the usable index entries.

A leaf entry generally contains:

```text
indexed key → row locator
```

For example:

```text
'maya@example.com' → location of Maya's table row
```

The exact row locator depends on the database and index type. It might be:

- A physical tuple or page address
- The row’s primary key
- The full row itself, for a clustered organization
- The indexed key plus additional included columns

For duplicate keys, the index needs a way to distinguish rows:

```text
'Smith' → row 104
'Smith' → row 811
'Smith' → row 992
```

Conceptually, the effective ordering may be something like:

```text
(last_name, row_identifier)
```

---

## 6. Looking up one value

Consider this tree:

```text
                           [ 30 | 60 ]
                          /     |      \
                         /      |       \
     [5, 10, 20, 25]  [30, 35, 45, 55]  [60, 70, 80, 90]
```

Run:

```sql
SELECT *
FROM items
WHERE item_number = 45;
```

The database proceeds as follows.

### Step 1: Read the root

The root contains:

```text
[30 | 60]
```

Because:

```text
30 ≤ 45 < 60
```

the database follows the middle child.

### Step 2: Search the leaf

The middle leaf contains:

```text
[30, 35, 45, 55]
```

The database finds `45`.

### Step 3: Fetch the row

The index entry identifies the corresponding table row. If the query needs columns not stored in the index, the database fetches that row from the table.

The tree search required only two node visits in this tiny example. A real index might require three or four page visits rather than millions of row comparisons.

The lookup cost is commonly described as:

\[
O(\log_b n)
\]

where \(b\) is the tree’s branching factor. Because \(b\) is large, the logarithm grows very slowly.

---

## 7. The difference between a B-tree and a B+ tree

In a classical B-tree, actual records can appear in internal and leaf nodes.

In a B+ tree:

- Internal nodes contain separator keys and child pointers.
- Records or row locators appear in leaf nodes.
- Leaves are linked in sorted order.

Conceptually:

```text
Internal nodes:
                      [30 | 60]

Linked leaves:
[5, 10, 20, 25] ↔ [30, 35, 45, 55] ↔ [60, 70, 80, 90]
```

Most database systems favor B+ trees because:

- Internal nodes remain compact, increasing the branching factor.
- Every lookup follows a consistent path to a leaf.
- Linked leaves make range scans efficient.

---

## 8. Range queries

B-tree indexes are especially useful for range conditions:

```sql
SELECT *
FROM items
WHERE item_number BETWEEN 35 AND 70;
```

The database does not independently search for every number.

Instead:

1. Navigate down the tree to the first qualifying key, `35`.
2. Read forward through the first leaf.
3. Follow the leaf link to the next leaf.
4. Stop after passing `70`.

```text
                       Start here
                           ↓
[5, 10, 20, 25] ↔ [30, 35, 45, 55] ↔ [60, 70, 80, 90]
                           └───────────────┘
                                scan
```

This is efficient because the index is already sorted.

Common index-friendly range conditions include:

```sql
WHERE price > 100
WHERE created_at >= '2026-01-01'
WHERE score BETWEEN 80 AND 90
WHERE name >= 'M' AND name < 'N'
```

---

## 9. Ordering

Because the index is ordered, it can sometimes satisfy `ORDER BY` without a separate sorting operation.

Given:

```sql
CREATE INDEX customers_created_at_idx
ON customers (created_at);
```

this query can scan the index in order:

```sql
SELECT *
FROM customers
ORDER BY created_at
LIMIT 20;
```

To get the newest rows first, many databases can scan the same index backward:

```sql
SELECT *
FROM customers
ORDER BY created_at DESC
LIMIT 20;
```

That can be dramatically cheaper than reading every row, sorting millions of rows, and then keeping only 20.

---

## 10. Inserting a key

Suppose each leaf in our simplified tree can hold at most four keys:

```text
                         [ 30 | 60 ]
                        /     |      \
       [5, 10, 20, 25]  [30, 35, 45, 55]  [60, 70, 80, 90]
```

Now insert `50`.

### Step 1: Find the target leaf

At the root:

```text
30 ≤ 50 < 60
```

So use the middle leaf:

```text
[30, 35, 45, 55]
```

### Step 2: Insert in sorted order

Temporarily:

```text
[30, 35, 45, 50, 55]
```

But the leaf can hold only four entries, so it overflows.

### Step 3: Split the leaf

Split it into two leaves:

```text
[30, 35]    [45, 50, 55]
```

### Step 4: Update the parent

The parent needs a new separator for the right-hand leaf:

```text
                      [ 30 | 45 | 60 ]
                     /      |      |       \
                    /       |      |        \
 [5,10,20,25]  [30,35]  [45,50,55]  [60,70,80,90]
```

The precise split point and separator rules differ by implementation, but the principle is consistent: split an overfull node and inform its parent.

---

## 11. Splitting the root

Splits can propagate upward.

Imagine the root is also full when a new separator must be added. The database splits the root and creates a new root above it:

```text
Before:

              [20 | 40 | 60 | 80]
             /    /    /    /    \


After:

                    [60]
                   /    \
           [20 | 40]    [80]
          /   |    \    /  \
```

This increases the tree’s height by one.

Notice that growth happens at the top, not by allowing one branch to become deeper. Therefore, all leaves remain at the same level.

---

## 12. Deleting a key

Deleting is roughly the reverse process.

Suppose a leaf contains:

```text
[30, 35, 45]
```

Delete `45`:

```text
[30, 35]
```

If the leaf still satisfies the database’s minimum occupancy rule, nothing more is required.

If it becomes too empty, the database may:

1. Borrow an entry from a sibling, or
2. Merge it with a sibling, then
3. Update the parent separator.

Simplified merge:

```text
Before:

Parent:       [30 | 45 | 60]
Leaves:   [30,35] [45] [60,70]

After deleting 45 and merging:

Parent:       [30 | 60]
Leaves:   [30,35] [60,70]
```

Real database implementations may delay merges, leave pages partially empty, or use maintenance processes to reclaim space. These choices reduce write costs and concurrency conflicts.

---

## 13. Why the tree stays balanced

A normal binary search tree can degenerate:

```text
1
 \
  2
   \
    3
     \
      4
```

This behaves like a linked list and produces \(O(n)\) lookup time.

A B-tree does not allow this shape. Splitting, redistribution, and merging enforce bounds on node occupancy, while every leaf remains at the same depth.

A tree can be sparse or fragmented, but it cannot develop one arbitrarily long branch.

---

## 14. Composite indexes

An index can contain more than one column:

```sql
CREATE INDEX orders_customer_date_idx
ON orders (customer_id, created_at);
```

Think of its entries as ordered tuples:

```text
(customer_id, created_at)
```

Example:

```text
(10, 2026-01-03)
(10, 2026-02-18)
(10, 2026-07-01)
(11, 2025-12-10)
(11, 2026-03-22)
(12, 2026-01-14)
```

The database first sorts by `customer_id`. Within each customer, it sorts by `created_at`.

This index is excellent for:

```sql
SELECT *
FROM orders
WHERE customer_id = 10
  AND created_at >= '2026-01-01';
```

The matching entries are one contiguous index range:

```text
(10, 2026-01-03)
(10, 2026-02-18)
(10, 2026-07-01)
```

It can also help with:

```sql
WHERE customer_id = 10
```

But it generally cannot perform a direct, narrow seek for this alone:

```sql
WHERE created_at = '2026-01-03'
```

because that date may appear separately under every customer:

```text
(1,  2026-01-03)
(2,  2026-01-03)
(3,  2026-01-03)
...
```

This is commonly called the **leftmost-prefix rule**.

For an index on:

```text
(a, b, c)
```

the natural searchable prefixes are:

```text
(a)
(a, b)
(a, b, c)
```

Not usually:

```text
(b)
(c)
(b, c)
```

Some databases have specialized strategies such as skip scans, but column order remains crucial.

---

## 15. Equality columns and range columns

Consider:

```sql
CREATE INDEX events_idx
ON events (account_id, event_type, created_at);
```

This query aligns well with the index:

```sql
SELECT *
FROM events
WHERE account_id = 42
  AND event_type = 'purchase'
  AND created_at >= '2026-08-01';
```

Conceptually, the database seeks to:

```text
(42, 'purchase', '2026-08-01')
```

and scans forward until the tuple no longer matches the required prefix.

Now consider:

```sql
WHERE account_id = 42
  AND created_at >= '2026-08-01'
```

The index can quickly isolate account `42`, but within that account the data is grouped first by `event_type`, then by date:

```text
(42, 'login',    dates...)
(42, 'purchase', dates...)
(42, 'refund',   dates...)
```

The date condition does not necessarily define one contiguous range across all event types. The database may need to examine more index entries.

A useful design heuristic is:

- Put columns tested by equality early.
- Put a range or ordering column after them.
- Still account for selectivity, query frequency, ordering needs, and database-specific behavior.

---

## 16. Composite indexes and `ORDER BY`

Given:

```sql
CREATE INDEX orders_idx
ON orders (customer_id, created_at);
```

this query can use the index ordering:

```sql
SELECT *
FROM orders
WHERE customer_id = 10
ORDER BY created_at;
```

All rows for customer `10` are adjacent and already ordered by `created_at`.

But this query may not be globally ordered by date through that index:

```sql
SELECT *
FROM orders
ORDER BY created_at;
```

The index order looks like:

```text
customer 1's dates
customer 2's dates
customer 3's dates
```

It is not one global date sequence.

---

## 17. Covering indexes

Suppose this query is common:

```sql
SELECT created_at, total
FROM orders
WHERE customer_id = 10;
```

An index on only `customer_id` finds the matching row locators, but the database may still need to fetch every table row to retrieve `created_at` and `total`.

A broader index could store all required values:

```sql
CREATE INDEX orders_customer_cover_idx
ON orders (customer_id, created_at, total);
```

Now the query may be answerable entirely from the index. This is an **index-only scan**, and the index is described as **covering** the query.

Some databases support included columns:

```sql
CREATE INDEX orders_customer_cover_idx
ON orders (customer_id)
INCLUDE (created_at, total);
```

Included columns are stored in leaf entries but do not necessarily participate in the tree’s search ordering.

Covering indexes can eliminate many random table-page reads, but they also:

- Consume more space
- Reduce the number of entries per page
- Increase index height in some cases
- Make inserts and updates more expensive

---

## 18. Clustered and secondary indexes

The terminology differs among database systems, but two broad arrangements matter.

### Clustered organization

The table rows themselves are stored in the B-tree’s leaf level, ordered by a clustering key.

Conceptually:

```text
Internal pages
     ↓
Leaf pages containing complete rows
```

A lookup reaches the row directly.

There can usually be only one physical clustering order because rows cannot simultaneously be physically arranged in several different orders.

### Secondary or nonclustered index

The leaf entries contain:

```text
secondary key → row locator or primary key
```

The database may perform two steps:

1. Find an entry in the secondary index.
2. Use its locator or primary key to fetch the full row.

In some systems, secondary indexes store the table’s primary key. A lookup through a secondary index can therefore become:

```text
secondary B-tree lookup
          ↓
primary/clustered B-tree lookup
          ↓
full row
```

This explains why a query returning many rows may not use a secondary index: thousands of scattered row lookups can be more expensive than reading the table sequentially.

---

## 19. Selectivity

An index is most useful when it narrows the result substantially.

Consider:

```sql
CREATE INDEX users_active_idx
ON users (active);
```

If 95% of users have:

```text
active = true
```

then this query returns most of the table:

```sql
SELECT *
FROM users
WHERE active = true;
```

Using the index might require:

1. Reading most leaf entries
2. Following millions of row locators
3. Reading most table pages in an inefficient order

A sequential table scan may be faster.

But the same index could help:

```sql
WHERE active = false
```

if only 5% of rows are inactive.

**Selectivity** measures how narrowly a predicate identifies rows. High-selectivity conditions generally benefit more from indexes.

An index on a low-cardinality column can still be useful when combined with other columns:

```sql
CREATE INDEX users_active_region_idx
ON users (active, region_id, created_at);
```

Whether it helps depends on actual query patterns and data distribution.

---

## 20. Why a database sometimes ignores an index

Having an applicable index does not mean the optimizer will use it.

The optimizer estimates the cost of alternatives such as:

- Sequential table scan
- B-tree index scan
- Index-only scan
- Bitmap index strategy
- Combining multiple indexes
- Reading another index to satisfy ordering

It considers factors including:

- Estimated number of matching rows
- Table and index size
- Data distribution
- Whether pages are already cached
- Random versus sequential I/O
- Columns required by the query
- Sorting requirements
- Correlation between index order and table order
- Parallel execution opportunities

For example:

```sql
SELECT *
FROM orders
WHERE total > 0;
```

If almost every order has a positive total, an index on `total` is unlikely to help.

---

## 21. Index-friendly and index-hostile predicates

Given:

```sql
CREATE INDEX users_email_idx
ON users (email);
```

A direct equality predicate is index-friendly:

```sql
WHERE email = 'maya@example.com'
```

A prefix search may also be usable:

```sql
WHERE email LIKE 'maya%'
```

A leading wildcard generally cannot identify a starting point:

```sql
WHERE email LIKE '%example.com'
```

The matching values may be scattered throughout the index.

Applying a function may also prevent ordinary use of the index:

```sql
WHERE LOWER(email) = 'maya@example.com'
```

The tree is sorted by `email`, not necessarily by `LOWER(email)`.

A function-based or expression index can solve that in databases that support it:

```sql
CREATE INDEX users_lower_email_idx
ON users (LOWER(email));
```

Likewise, this may be problematic:

```sql
WHERE YEAR(created_at) = 2026
```

A range usually maps more directly to a regular index:

```sql
WHERE created_at >= '2026-01-01'
  AND created_at <  '2027-01-01'
```

The broader idea is **sargability**: write a predicate so the database can derive a contiguous search range in the index.

---

## 22. `NULL` values

Handling of `NULL` is database-specific.

A B-tree index may:

- Store null-valued entries
- Omit wholly null keys
- Order nulls before or after non-null values
- Treat uniqueness with nulls according to special rules

Therefore, queries such as:

```sql
WHERE deleted_at IS NULL
```

may or may not benefit from a conventional index depending on the database, data distribution, and index definition.

A partial or filtered index can be especially effective:

```sql
CREATE INDEX active_users_idx
ON users (id)
WHERE deleted_at IS NULL;
```

This indexes only active users.

---

## 23. Unique indexes

A unique index prevents duplicate indexed keys:

```sql
CREATE UNIQUE INDEX users_email_unique_idx
ON users (email);
```

During an insert:

```sql
INSERT INTO users (email)
VALUES ('maya@example.com');
```

the database searches the index for the key. If it already exists, the insert fails.

So a unique index serves two purposes:

- Fast lookup
- Constraint enforcement

Concurrency makes this more complicated internally: two transactions might attempt to insert the same value simultaneously. The database uses locking, latching, transaction visibility, or other coordination to ensure only a valid result commits.

---

## 24. Page splits and write amplification

Every additional index makes reads potentially faster but writes more expensive.

An insertion into a table may require:

1. Writing the table row
2. Updating the primary index
3. Updating every applicable secondary index
4. Splitting pages if necessary
5. Recording changes in a write-ahead log
6. Maintaining transactional metadata

If a table has ten indexes, one logical insert may update eleven physical structures.

Updates are also expensive when indexed values change:

```sql
UPDATE customers
SET email = 'new@example.com'
WHERE id = 42;
```

The database may need to:

1. Remove or invalidate the old email-index entry
2. Add a new entry in a different leaf
3. Update the table row

This is why “index every column” is usually poor design.

---

## 25. Sequential versus random insert patterns

Suppose the indexed key is an increasing integer:

```text
1001, 1002, 1003, 1004, ...
```

New entries mostly arrive at the rightmost leaf:

```text
... ↔ [991, 992, 993] ↔ [994, 995, 996] ↔ [997, 998, 999]
                                                       ↑
                                                  new inserts
```

Advantages:

- Good locality
- Predictable insertion point
- Often compact storage

Possible disadvantage:

- The rightmost page can become a concurrency hotspot.

Random keys, such as randomly distributed identifiers, spread writes across the index:

```text
insert here   insert here           insert here
     ↓             ↓                     ↓
[small keys] ↔ [middle keys] ↔ [...] ↔ [large keys]
```

This may reduce a single hot page but can cause:

- More page splits
- Poorer cache locality
- More fragmentation
- A larger index

The exact tradeoff depends heavily on the database and workload.

---

## 26. Fill factor

Some databases let you build an index with pages intentionally not completely full.

For example, a fill factor of 80% leaves roughly 20% free space for future insertions.

Conceptually:

```text
Full page:
[A B C D E F G H]

80%-filled page:
[A B C D E F _ _]
```

This can reduce page splits for keys inserted into existing ranges.

The cost is:

- More pages immediately
- More storage
- More page reads
- Potentially a taller tree

Fill factor is a workload-specific tuning tool, not a universal improvement.

---

## 27. Concurrency: locks versus latches

B-tree operations occur concurrently.

Two concepts are easy to confuse:

- **Locks** protect logical database data according to transaction isolation rules.
- **Latches** or similar lightweight mechanisms protect in-memory data structures while they are being modified.

During a page split, the database must prevent other threads from observing corrupted intermediate state. At the same time, it tries to avoid blocking unrelated operations elsewhere in the tree.

Modern database B-trees use sophisticated protocols so readers and writers can proceed concurrently. Some systems also use multi-version concurrency control, allowing readers to see an earlier committed version while writes continue.

---

## 28. A complete worked example

Consider:

```sql
CREATE TABLE orders (
    id          BIGINT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    status      VARCHAR(20) NOT NULL,
    created_at  TIMESTAMP NOT NULL,
    total       DECIMAL(12, 2) NOT NULL
);
```

Frequent query:

```sql
SELECT id, created_at, total
FROM orders
WHERE customer_id = 42
  AND status = 'paid'
  AND created_at >= '2026-01-01'
ORDER BY created_at;
```

A suitable index might be:

```sql
CREATE INDEX orders_customer_status_date_idx
ON orders (customer_id, status, created_at);
```

Its logical order is:

```text
customer_id
    then status
        then created_at
```

Sample entries:

```text
(41, 'paid',    2026-07-01) → row A
(42, 'failed',  2026-02-01) → row B
(42, 'paid',    2025-12-20) → row C
(42, 'paid',    2026-01-05) → row D
(42, 'paid',    2026-03-11) → row E
(42, 'paid',    2026-08-02) → row F
(42, 'pending', 2026-01-02) → row G
(43, 'paid',    2026-01-04) → row H
```

The database can derive a starting tuple:

```text
(42, 'paid', 2026-01-01)
```

It descends the tree to that location and scans:

```text
(42, 'paid', 2026-01-05)
(42, 'paid', 2026-03-11)
(42, 'paid', 2026-08-02)
```

It stops when the prefix changes from:

```text
(42, 'paid', ...)
```

The entries are already ordered by `created_at`, so no additional sorting may be necessary.

If the index includes everything the query needs:

```sql
CREATE INDEX orders_customer_status_date_cover_idx
ON orders (customer_id, status, created_at)
INCLUDE (id, total);
```

then the database may avoid fetching the table rows entirely.

---

## 29. Why column order changes everything

Compare these indexes:

```sql
-- Index A
(customer_id, status, created_at)

-- Index B
(created_at, customer_id, status)
```

For this query:

```sql
WHERE customer_id = 42
  AND status = 'paid'
  AND created_at >= '2026-01-01'
```

Index A creates one narrow contiguous range:

```text
(42, 'paid', dates from 2026 onward)
```

Index B begins with all records from 2026 onward:

```text
(2026 date, every customer, every status)
```

The database can test `customer_id` and `status`, but it may have to scan a much larger portion of the index.

Index B might instead be appropriate for:

```sql
WHERE created_at >= '2026-01-01'
ORDER BY created_at;
```

There is no universally correct column order. An index should be designed around concrete query shapes.

---

## 30. Cost intuition

Suppose:

- The table has 100 million rows.
- The B-tree is four pages tall.
- A query matches one row.

A rough access pattern might be:

```text
root page
   ↓
internal page
   ↓
internal page
   ↓
leaf page
   ↓
table page
```

That is perhaps five logical page accesses, some likely cached.

Now suppose the query matches 40 million rows. The initial tree descent is still cheap, but scanning 40 million index entries and fetching their rows is not. The expensive part is no longer finding the first entry; it is processing the result set.

This yields an important principle:

> Indexes make locating a range cheap. They do not make processing a huge result set free.

---

## 31. B-tree indexes versus hash indexes

A hash index maps keys into buckets.

It is naturally suited to equality:

```sql
WHERE email = 'maya@example.com'
```

But it does not preserve key order, so it is generally unsuitable for:

```sql
WHERE created_at > '2026-01-01'
ORDER BY created_at
WHERE name LIKE 'Mar%'
MIN(price)
MAX(price)
```

A B-tree supports equality while also supporting ranges and ordering. That versatility is why it is usually the default general-purpose database index.

---

## 32. B-tree indexes versus specialized indexes

B-trees are not ideal for every data type or query.

Other index families may be better for:

- Full-text search
- Geospatial containment and nearest-neighbor search
- JSON or array membership
- Similarity and vector search
- Highly analytical bitmap-style filtering
- Trigram or fuzzy string matching

B-trees are strongest when values have a useful total ordering and queries seek equality, prefixes, ranges, or sorted output.

---

## 33. Common misconceptions

### “An index always makes a query faster”

No. It can be slower when the query returns a large percentage of the table or requires many random row fetches.

### “More indexes are always better”

No. Every index consumes storage and adds write, maintenance, backup, and cache costs.

### “An index on `(a, b)` is equivalent to indexes on `a` and `b`”

No. `(a, b)` is ordered primarily by `a`. It is not generally a replacement for an index beginning with `b`.

### “A primary key is just a constraint”

Usually it is backed by a unique index, though exact implementation details vary.

### “The database walks every level from storage on every query”

Not necessarily. Upper tree pages are frequently cached because they are small and accessed constantly.

### “Logarithmic means the index is always tiny”

Lookup depth is small, but the leaf level can still occupy many gigabytes. Leaf scans, cache pressure, and maintenance costs matter.

---

## 34. Practical index-design process

When considering an index, start with the actual query:

```sql
SELECT ...
FROM ...
WHERE ...
ORDER BY ...
LIMIT ...
```

Then ask:

1. Which columns use equality conditions?
2. Which column uses a range condition?
3. Does the query need a particular ordering?
4. How many rows are likely to match?
5. Which columns must be returned?
6. Is avoiding table lookups worth a larger covering index?
7. How frequently is the table written?
8. Does an existing index already cover the same useful prefix?

Then inspect the execution plan using the database’s plan tools, such as `EXPLAIN` or `EXPLAIN ANALYZE`.

Do not evaluate an index only by whether it appears in the plan. Also inspect:

- Estimated versus actual row counts
- Rows examined
- Page or buffer activity
- Sort operations
- Table lookups
- Total execution time
- Behavior with realistic parameter values

---

## 35. The compact mental model

Think of a B-tree index as a sorted book with a hierarchy of directories:

```text
Root:
    Which broad key range?

Internal page:
    Which narrower range?

Leaf page:
    Here are the exact sorted entries.

Row locator:
    Here is the table row.
```

Its essential strengths come from four properties:

- **Balanced:** every lookup has roughly the same depth.
- **Wide:** each page points to many children, keeping the tree shallow.
- **Sorted:** equality, range, prefix, and ordering queries are efficient.
- **Page-oriented:** its structure matches how databases read and write storage.

Its essential cost is that every maintained ordering requires extra storage and extra work whenever data changes.
