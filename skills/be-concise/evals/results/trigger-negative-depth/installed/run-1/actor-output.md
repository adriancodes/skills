A B-tree index is a balanced, sorted data structure that lets a database find rows without scanning every row in a table.

Despite the name, most relational databases use a variant called a **B+ tree**. Database documentation often calls it a “B-tree index,” so I’ll use that conventional term.

## 1. The problem an index solves

Imagine a table containing one million customers:

```sql
CREATE TABLE customers (
    id         BIGINT PRIMARY KEY,
    email      VARCHAR(255),
    last_name  VARCHAR(100),
    created_at TIMESTAMP
);
```

Without an index on `last_name`, this query may require examining every row:

```sql
SELECT *
FROM customers
WHERE last_name = 'Nguyen';
```

That is a **table scan**:

```text
Row 1: Smith     no
Row 2: Patel     no
Row 3: Nguyen    yes
...
Row 1,000,000
```

The work grows roughly in proportion to the table size: **O(n)**.

Now create an index:

```sql
CREATE INDEX idx_customers_last_name
ON customers(last_name);
```

The database constructs a sorted search structure:

```text
Adams
Brown
Chen
...
Nguyen
...
Zimmerman
```

It can navigate directly to the region containing `Nguyen`, usually in **O(log n)** tree navigation plus the cost of reading matching entries.

The index does not eliminate all work. It dramatically narrows where the database must look.

---

## 2. Why not use one giant sorted list?

A sorted array supports fast binary search, but databases also need to:

- Insert new values.
- Delete old values.
- Update indexed values.
- Store data on fixed-size disk pages.
- Minimize expensive page reads.
- Support many concurrent operations.

Inserting into the middle of a giant sorted array might require moving enormous amounts of data.

A B-tree divides the sorted entries into **pages**, or nodes. Each page holds many entries, and pages can split or merge independently.

This provides:

- Sorted lookup.
- Efficient insertion and deletion.
- Predictable balance.
- High branching factors.
- Few disk-page reads.

---

## 3. The basic structure

A small conceptual B-tree might look like this:

```text
                         [ 30 | 60 ]
                       /      |      \
              [10 20]      [40 50]      [70 80 90]
```

The root contains separator values:

- Values below `30` are in the left child.
- Values from `30` through values below `60` are in the middle child.
- Values at or above `60` are in the right child.

Real database B-tree indexes usually resemble B+ trees:

```text
                         Internal pages
                         [ 30 | 60 ]
                       /      |      \
                      /       |       \
Leaf pages:   [10 20 25] -> [30 40 50] -> [60 70 80 90]
```

Important properties:

1. **Entries are sorted.**
2. **Every leaf is at the same depth.**
3. **Internal pages guide searches.**
4. **Leaf pages contain index entries.**
5. **Leaf pages are normally linked in order.**

Linked leaves make range scans efficient.

---

## 4. What an index entry contains

An index entry normally contains:

```text
indexed key + row locator
```

Conceptually:

```text
("Nguyen", row 814)
("Nguyen", row 920)
("Patel",  row 117)
```

The exact row locator depends on the database and table organization. It could be:

- A physical tuple location.
- A primary-key value.
- A pointer or record identifier.
- Enough indexed data to answer the query without visiting the table.

Suppose the table contains:

```text
id  last_name
--  ---------
17  Patel
23  Nguyen
41  Smith
52  Nguyen
```

The index might logically contain:

```text
Nguyen -> row for id 23
Nguyen -> row for id 52
Patel  -> row for id 17
Smith  -> row for id 41
```

The index is sorted by `last_name`, not by the table’s physical row order.

---

## 5. Step-by-step equality lookup

Consider:

```sql
SELECT *
FROM customers
WHERE last_name = 'Nguyen';
```

Assume this simplified index:

```text
Root:
[ Garcia | Patel | Williams ]

Children:
A: [ Adams ... Garcia )
B: [ Garcia ... Patel )
C: [ Patel ... Williams )
D: [ Williams ... ]
```

The database proceeds as follows.

### Step 1: Read the root

Compare `Nguyen` with the separators:

```text
Garcia < Nguyen < Patel
```

Therefore, follow child B.

### Step 2: Read an internal child

That page may contain more separators:

```text
[ Jackson | Miller | Owens ]
```

Since:

```text
Miller < Nguyen < Owens
```

follow the corresponding child.

### Step 3: Reach a leaf page

The leaf might contain:

```text
Morgan
Morris
Ng
Nguyen -> row locator 1
Nguyen -> row locator 2
Nielsen
```

The database performs a search within that page and finds the first matching entry.

### Step 4: Read duplicate entries

Because multiple customers may have the same last name, it reads consecutive `Nguyen` entries.

### Step 5: Fetch table rows

For `SELECT *`, the engine usually follows each row locator to the base table.

This last part matters: finding index entries cheaply does not guarantee that fetching thousands of scattered table rows will also be cheap.

---

## 6. Why the tree stays shallow

B-trees are not binary trees. An internal page can have hundreds of children.

Suppose:

- A page can reference 400 child pages.
- Each leaf holds 300 entries.

Then an approximate capacity is:

```text
Height 1:        300 entries
Height 2:    400 × 300 = 120,000 entries
Height 3: 400² × 300 = 48,000,000 entries
Height 4: 400³ × 300 = 19,200,000,000 entries
```

A tree indexing millions of rows may require only a few page traversals from root to leaf.

Frequently accessed upper pages are often cached, making searches even cheaper.

---

## 7. Range queries

B-tree indexes are particularly good at ranges:

```sql
SELECT *
FROM customers
WHERE last_name >= 'M'
  AND last_name < 'N';
```

The engine:

1. Navigates down the tree to the first value at or above `M`.
2. Reads entries sequentially from that leaf.
3. Follows the next-leaf pointer when the page ends.
4. Stops when it reaches `N`.

Conceptually:

```text
... -> [Lopez, Martin, Miller] -> [Mitchell, Moore, Morgan] -> [Nash, Nelson]
             start here                                      stop here
```

The database does not repeatedly navigate from the root for every value. It finds the starting position once, then walks through linked leaf pages.

This supports predicates such as:

```sql
WHERE price > 100
WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31'
WHERE name LIKE 'Mar%'
```

A prefix pattern such as `LIKE 'Mar%'` describes a contiguous sorted range. A leading-wildcard pattern usually does not:

```sql
WHERE name LIKE '%aria'
```

Values ending in `aria` are scattered throughout an index sorted from the beginning of each string.

---

## 8. Insertions and page splits

Suppose a leaf has capacity for four keys:

```text
[10, 20, 30, 40]
```

Now insert `25`.

The page cannot fit another key, so it temporarily becomes:

```text
[10, 20, 25, 30, 40]
```

The database splits it:

```text
[10, 20]    [25, 30, 40]
```

A separator is inserted into the parent:

```text
Parent: [... | 25 | ...]
```

The parent now knows:

- Values below `25` use the left page.
- Values at or above `25` use the right page.

If the parent is also full, it splits too. Splits can propagate upward.

If the root splits, a new root is created:

```text
Before:

          [10, 20, 30, 40]

After:

              [25]
             /    \
       [10, 20]  [25, 30, 40]
```

This is how the tree grows taller while remaining balanced.

---

## 9. Why “balanced” matters

A naive binary search tree can become skewed:

```text
10
  \
   20
     \
      30
        \
         40
```

Searching this structure may become O(n).

A B-tree enforces occupancy and splitting rules so that all leaves stay at the same depth:

```text
          root
        /      \
   internal   internal
    /   \      /   \
  leaf leaf  leaf leaf
```

No leaf ends up dozens of levels deeper than another. Search, insertion, and deletion remain logarithmic in the number of entries.

---

## 10. Deletions and underfull pages

Suppose a leaf contains:

```text
[10, 20, 30]
```

After deleting `20`:

```text
[10, 30]
```

That may be fine. Pages do not normally need to be completely full.

If enough entries are deleted, a page may become too empty. Depending on the database and situation, the engine can:

- Borrow entries from a neighboring page.
- Merge two pages.
- Update parent separators.
- Leave reusable free space.
- Rebuild or reorganize the index later.

Conceptually, two sparse pages:

```text
[10]    [20]
```

might merge into:

```text
[10, 20]
```

Real databases differ in when and how aggressively they merge, compact, or reclaim index space.

---

## 11. Composite indexes

An index can contain multiple columns:

```sql
CREATE INDEX idx_orders_customer_date
ON orders(customer_id, created_at);
```

This is sorted lexicographically:

```text
(customer_id, created_at)
```

Example entries:

```text
(10, 2026-01-02)
(10, 2026-01-14)
(10, 2026-03-01)
(11, 2025-12-20)
(11, 2026-02-08)
(12, 2026-01-01)
```

Think of a telephone directory:

1. Sort by last name.
2. Within each last name, sort by first name.

### Query using both columns

```sql
SELECT *
FROM orders
WHERE customer_id = 10
  AND created_at >= '2026-01-01';
```

This is excellent for the index. All relevant entries occupy one contiguous range:

```text
(10, 2026-01-01) through the last entry beginning with 10
```

### Query using only the first column

```sql
SELECT *
FROM orders
WHERE customer_id = 10;
```

Also excellent. Entries for customer 10 are grouped together.

### Query using only the second column

```sql
SELECT *
FROM orders
WHERE created_at >= '2026-01-01';
```

Usually much less effective.

Why? The entries are primarily grouped by `customer_id`:

```text
customer 10: dates...
customer 11: dates...
customer 12: dates...
```

All recent dates are not necessarily one compact region across every customer.

This produces the common **leftmost-prefix rule**: an index on `(a, b, c)` naturally supports searches beginning with:

```text
a
a, b
a, b, c
```

It generally cannot perform a simple direct seek using only `b` or only `c`.

Some databases have additional strategies such as skip scans, but the ordering principle remains important.

---

## 12. Equality columns before range columns

Consider:

```sql
WHERE customer_id = 10
  AND created_at >= '2026-01-01'
```

An index on:

```sql
(customer_id, created_at)
```

usually makes sense because:

1. Equality on `customer_id` identifies one group.
2. The database then performs a date range scan inside that group.

Now consider:

```sql
WHERE customer_id > 10
  AND created_at = '2026-01-01'
```

With the same index, once the database begins scanning a range of customer IDs, matching dates may be distributed throughout that range.

A useful—not universal—design heuristic is:

```text
equality-filtered columns, then range/sort columns
```

Actual choices should be driven by complete query patterns, selectivity, ordering needs, and database behavior.

---

## 13. Sorting with an index

Suppose you run:

```sql
SELECT *
FROM orders
WHERE customer_id = 10
ORDER BY created_at;
```

The index:

```sql
(customer_id, created_at)
```

already stores customer 10’s entries in date order:

```text
(10, Jan 2)
(10, Jan 14)
(10, Mar 1)
```

The database may avoid a separate sort.

It can often scan in reverse too:

```sql
ORDER BY created_at DESC
```

This makes B-tree indexes useful for queries such as:

```sql
SELECT *
FROM orders
WHERE customer_id = 10
ORDER BY created_at DESC
LIMIT 20;
```

The engine can jump to the newest entry for customer 10 and stop after 20 rows.

Without a suitable index, it might need to:

1. Find all orders for the customer.
2. Sort them.
3. Return the first 20.

---

## 14. Covering indexes

Consider:

```sql
SELECT customer_id, created_at
FROM orders
WHERE customer_id = 10
ORDER BY created_at;
```

If both requested columns are stored in the index:

```sql
(customer_id, created_at)
```

the engine may answer the query using only index pages. This is often called an **index-only scan** or a query using a **covering index**.

Now consider:

```sql
SELECT customer_id, created_at, total_amount
FROM orders
WHERE customer_id = 10
ORDER BY created_at;
```

If `total_amount` is absent from the index, the database normally must fetch the matching table rows.

Some systems let you add non-key included columns:

```sql
CREATE INDEX idx_orders_customer_date
ON orders(customer_id, created_at)
INCLUDE (total_amount);
```

Conceptually:

- `customer_id` and `created_at` control tree ordering.
- `total_amount` is stored at the leaf to help cover queries.
- `total_amount` does not become another navigation level in the search key.

Syntax and exact behavior vary between databases.

---

## 15. Selectivity and why an index may be ignored

An index is not automatically faster.

Suppose a table has ten million rows and a column:

```text
status = 'active' for 9,500,000 rows
status = 'inactive' for 500,000 rows
```

This query returns nearly the whole table:

```sql
SELECT *
FROM accounts
WHERE status = 'active';
```

Using the index might require:

1. Reading millions of index entries.
2. Following millions of row locators.
3. Fetching table pages in scattered order.

A sequential table scan may be cheaper because it reads table pages directly and predictably.

The optimizer estimates costs using statistics such as:

- Row count.
- Number of distinct values.
- Value frequencies.
- Histograms.
- Null fraction.
- Correlations.
- Estimated number of matching rows.

An index is most compelling when it sharply reduces the search space, provides required ordering, covers the query, or enables early termination with `LIMIT`.

---

## 16. Random table lookups

Suppose an index finds these row locations:

```text
table page 81
table page 9,120
table page 402
table page 77,010
```

Fetching those rows may require scattered I/O. This is sometimes called a bookmark lookup, key lookup, or heap/table fetch, depending on the database.

For five rows, this is usually fine.

For five million rows, it can be disastrous compared with scanning the table once.

That is why query performance depends on both:

```text
cost to find index entries
+
cost to retrieve matching rows
```

A covering index can eliminate or reduce the second cost.

---

## 17. Clustered versus nonclustered organization

Terminology varies significantly by database.

Conceptually, a **clustered** organization stores table rows in, or according to, the primary index order:

```text
Leaf:
[key 10 + complete row]
[key 11 + complete row]
[key 12 + complete row]
```

A **secondary** or **nonclustered** index stores keys with row locators:

```text
[last_name "Nguyen" + locator]
```

Consequences of clustered ordering:

- Range queries on the clustered key can read nearby rows efficiently.
- Only one physical ordering can dominate the table.
- Secondary indexes may need to store the clustered primary key as their row locator.
- A large primary key can therefore make secondary indexes larger.

The exact architecture differs among PostgreSQL, MySQL/InnoDB, SQL Server, Oracle, SQLite, and other systems, so these terms should not be assumed to mean precisely the same thing everywhere.

---

## 18. Unique indexes

A unique index enforces that a key appears at most once:

```sql
CREATE UNIQUE INDEX idx_customers_email
ON customers(email);
```

Before inserting:

```text
alex@example.com
```

the database searches the B-tree for that value.

- If it exists, the insert fails.
- If it does not, the new entry is added.

A unique index therefore serves two roles:

1. Efficient lookup.
2. Constraint enforcement.

Handling of `NULL` values varies by database and constraint semantics.

---

## 19. NULL values

Whether and how nulls appear in a B-tree index depends on the database.

Potential behaviors include:

- Null entries are indexed.
- Null entries are omitted.
- Multiple nulls are allowed in a unique index.
- Nulls sort first or last.
- The ordering can be configured.

Queries such as:

```sql
WHERE deleted_at IS NULL
```

can sometimes use an index effectively, especially when the database supports a filtered or partial index:

```sql
CREATE INDEX idx_active_records
ON records(id)
WHERE deleted_at IS NULL;
```

That index contains only active records and may be much smaller than a full-table index.

---

## 20. Expressions can prevent a simple index seek

Assume an index on:

```sql
created_at
```

This predicate naturally describes a range:

```sql
WHERE created_at >= '2026-01-01'
  AND created_at <  '2026-02-01'
```

But this version applies a function to every indexed value:

```sql
WHERE EXTRACT(YEAR FROM created_at) = 2026
```

A plain index on `created_at` may be harder or impossible to use for direct navigation, depending on the optimizer.

Why? The index is sorted by raw timestamps, not necessarily by the computed expression.

Possible solutions include:

- Rewrite the predicate as a raw timestamp range.
- Create an expression or function-based index if supported.
- Add and index a generated column.

Similarly:

```sql
WHERE LOWER(email) = 'alex@example.com'
```

may need an index on `LOWER(email)` rather than only `email`.

---

## 21. Sargability

A predicate is often called **sargable** when the database can translate it into a useful index search range.

Typically sargable:

```sql
WHERE price = 100
WHERE price >= 100
WHERE created_at BETWEEN x AND y
WHERE name LIKE 'Alex%'
```

Often less sargable:

```sql
WHERE price + 10 = 110
WHERE YEAR(created_at) = 2026
WHERE name LIKE '%Alex'
```

For example:

```sql
WHERE price + 10 = 110
```

can be rewritten as:

```sql
WHERE price = 100
```

This lets an index on `price` navigate directly to the target.

“Sargable” is useful shorthand, but actual optimizer capabilities vary. Some engines can transform particular expressions automatically.

---

## 22. Data types and implicit conversions

Suppose `customer_id` is an integer, but a comparison causes the indexed column to be converted:

```sql
WHERE CAST(customer_id AS TEXT) = '123'
```

The B-tree is sorted by integer values, while the query asks about a text transformation. That can prevent a straightforward seek.

A matching comparison is preferable:

```sql
WHERE customer_id = 123
```

Implicit type conversions can have a similar effect. The important question is:

> Can the engine express the predicate as a contiguous range in the index’s stored ordering?

---

## 23. Ordering and composite indexes

Suppose an index is:

```sql
(a, b)
```

The entries are ordered like:

```text
(1, 1)
(1, 2)
(1, 3)
(2, 1)
(2, 2)
(3, 1)
```

This index naturally satisfies:

```sql
ORDER BY a, b
```

It can also satisfy:

```sql
WHERE a = 1
ORDER BY b
```

Within a fixed value of `a`, entries are sorted by `b`.

It generally does not globally satisfy:

```sql
ORDER BY b
```

The `b` values appear as:

```text
1, 2, 3, 1, 2, 1
```

They restart for every value of `a`.

---

## 24. A detailed composite-index example

Consider:

```sql
CREATE TABLE events (
    tenant_id  BIGINT,
    event_type VARCHAR(50),
    created_at TIMESTAMP,
    payload    JSON
);
```

A common query is:

```sql
SELECT event_type, created_at
FROM events
WHERE tenant_id = 42
  AND event_type = 'login'
  AND created_at >= '2026-07-01'
ORDER BY created_at;
```

A suitable index is:

```sql
CREATE INDEX idx_events_tenant_type_date
ON events(tenant_id, event_type, created_at);
```

Logical ordering:

```text
(41, login,    July 1)
(42, download, July 2)
(42, login,    June 30)
(42, login,    July 1)
(42, login,    July 3)
(42, logout,   July 1)
(43, login,    July 1)
```

The engine can:

1. Seek to the prefix `(42, 'login')`.
2. Within that prefix, seek to the first date at or after July 1.
3. Scan forward.
4. Stop when the tenant, event type, or date range no longer matches.
5. Return rows already ordered by `created_at`.

Because the selected columns are present in the index, an index-only scan may also be possible.

Now change the query:

```sql
WHERE event_type = 'login'
  AND created_at >= '2026-07-01'
```

With no `tenant_id` constraint, relevant rows are distributed across every tenant’s region. The same index becomes less suitable.

A separate index might be required:

```sql
(event_type, created_at)
```

But adding indexes has costs.

---

## 25. The cost of maintaining indexes

Every additional index consumes:

- Storage.
- Memory/cache capacity.
- Insert work.
- Delete work.
- Update work.
- Logging and replication bandwidth.
- Maintenance time.
- Optimizer planning complexity.

Suppose a table has five indexes and one row is inserted. The database must usually:

1. Insert the table row.
2. Insert an entry into index 1.
3. Insert an entry into index 2.
4. Continue for all five indexes.
5. Potentially split pages.
6. Record the changes for recovery and replication.

Updating an indexed column often acts like:

```text
delete old index entry
+
insert new index entry
```

Therefore, “index every column” is rarely a good strategy.

---

## 26. Page locality and insertion patterns

Consider an index on an increasing ID:

```text
1001, 1002, 1003, 1004, ...
```

New entries usually arrive at the rightmost leaf. Advantages include:

- Good locality.
- Predictable insertion point.
- Relatively compact pages.

But under high concurrency, the rightmost page can become a contention hotspot.

Now consider uniformly random keys, such as random UUIDs:

```text
05...
A7...
32...
F1...
```

Inserts land throughout the tree. Potential consequences include:

- More page reads.
- More page splits.
- Less cache locality.
- Greater fragmentation.
- Less predictable write behavior.

This does not mean random keys are always wrong; they offer other benefits. It means key shape affects physical index behavior.

---

## 27. Page splits and fragmentation

Suppose adjacent leaf pages initially hold:

```text
Page A: [10, 20, 30, 40]
Page B: [50, 60, 70, 80]
```

Insert `25` into full Page A. It splits:

```text
Page A: [10, 20]
Page C: [25, 30, 40]
Page B: [50, 60, 70, 80]
```

Depending on the storage engine, Page C might not be physically adjacent to Page A. Logical ordering is preserved through tree pointers, but physical locality can degrade.

Repeated inserts, updates, and deletes can create:

- Partially empty pages.
- More pages than necessary.
- Poor physical locality.
- Increased tree size.
- Reduced cache efficiency.

Databases provide different maintenance mechanisms, such as rebuilding, reorganizing, vacuuming, or online compaction. Maintenance should be based on measured behavior, not performed automatically without understanding the engine.

---

## 28. Concurrency

Many transactions may search and modify the same B-tree simultaneously.

The database must coordinate:

- Page reads.
- Entry insertion.
- Splits.
- Deletions.
- Transaction visibility.
- Crash recovery.
- Unique checks.

Engines use techniques such as:

- Latches for short-lived in-memory page protection.
- Transaction locks.
- Multi-version concurrency control.
- Write-ahead logging.
- Specialized split protocols.
- Predicate or range locking where required.

A subtle distinction:

- A **latch** protects an internal data structure briefly.
- A **transaction lock** protects logical data according to isolation semantics.

Exact terminology varies, but balancing concurrency with structural correctness is a major part of real B-tree implementation.

---

## 29. Why indexes may not contain only currently visible rows

In multi-version databases, an update may create a new row version while an old version remains temporarily present.

An index search may find entries whose table versions are:

- Visible to the current transaction.
- Invisible because they were created later.
- Obsolete but not yet reclaimed.
- Visible only to other transaction snapshots.

The database checks transaction visibility before returning results.

This is one reason an “index-only” scan can still require additional metadata checks or table access in some systems.

---

## 30. Prefix compression and key size

Internal pages need separator keys. If keys are large, fewer entries fit per page:

```text
fewer entries per page
→ lower branching factor
→ more pages
→ possibly a taller tree
→ more cache pressure
```

Some engines compress repeated prefixes. For example:

```text
customer/000001
customer/000002
customer/000003
```

share a long prefix:

```text
customer/00000
```

Compression can allow more entries per page.

This is one reason index key width matters. An index on several wide text columns can be much more expensive than an index on compact values.

---

## 31. B-tree versus hash indexes

A hash index conceptually maps:

```text
key → bucket
```

It is naturally suited to equality:

```sql
WHERE id = 123
```

But it generally does not preserve ordering, making operations such as these difficult:

```sql
WHERE id BETWEEN 100 AND 200
ORDER BY id
WHERE name LIKE 'Mar%'
MIN(id)
MAX(id)
```

A B-tree supports equality and ordered operations, so it is the broadly useful default.

---

## 32. B-tree versus specialized indexes

B-trees are excellent for scalar values with meaningful ordering:

- Numbers.
- Timestamps.
- Strings.
- IDs.
- Composite tuples.

Other query types may favor specialized structures:

- Full-text search: inverted indexes.
- Spatial containment and proximity: spatial trees or GiST-like structures.
- JSON/array membership: inverted or generalized indexes.
- Time-series block summaries: BRIN-like indexes.
- Vector similarity: HNSW, IVF, or related approximate-nearest-neighbor indexes.
- Exact equality in specialized engines: hash indexes.

The right question is not “Are B-trees fast?” but:

> Does the index’s ordering match the relationship expressed by the query?

---

## 33. Reading query plans

To determine whether an index is used, inspect the execution plan:

```sql
EXPLAIN
SELECT *
FROM customers
WHERE last_name = 'Nguyen';
```

Possible conceptual operators include:

```text
Index Seek
Index Scan
Index-Only Scan
Bitmap Index Scan
Table Scan
Key Lookup
Sort
```

Meanings vary by engine, but broadly:

- **Index seek:** navigate to a narrow key or range.
- **Index scan:** read a substantial portion of the index.
- **Index-only scan:** obtain needed values from the index.
- **Table scan:** examine table pages directly.
- **Key/table lookup:** fetch base rows after finding index entries.
- **Sort:** ordering was not fully supplied by an access path.

Use actual execution statistics when possible. Estimates alone can hide problems caused by inaccurate statistics or parameter-sensitive plans.

---

## 34. A complete worked example

Suppose an `orders` table has 50 million rows:

```sql
CREATE TABLE orders (
    id          BIGINT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    status      VARCHAR(20) NOT NULL,
    created_at  TIMESTAMP NOT NULL,
    total       DECIMAL(12,2) NOT NULL
);
```

The application frequently runs:

```sql
SELECT id, created_at, total
FROM orders
WHERE customer_id = 781
  AND status = 'paid'
  AND created_at >= '2026-01-01'
ORDER BY created_at DESC
LIMIT 25;
```

Create:

```sql
CREATE INDEX idx_orders_customer_status_date
ON orders(customer_id, status, created_at);
```

The index is ordered conceptually as:

```text
(customer_id, status, created_at)
```

The engine’s work is approximately:

1. Traverse the root and internal pages.
2. Locate the range beginning with `(781, 'paid')`.
3. Position near the newest matching date.
4. Scan backward in date order.
5. Ignore entries older than January 1.
6. Stop after 25 matches.
7. Fetch `id` and `total` from the index or table, depending on index contents and engine design.

If supported, an index with included columns could cover the query:

```sql
CREATE INDEX idx_orders_customer_status_date
ON orders(customer_id, status, created_at)
INCLUDE (id, total);
```

Potential benefit:

```text
tree navigation
→ read 25 leaf entries
→ return results
```

Potential downside:

- Larger leaf pages.
- More write cost.
- More cache consumption.

Now consider this query:

```sql
SELECT *
FROM orders
WHERE status = 'paid';
```

The composite index begins with `customer_id`, so it is poorly aligned with a status-only lookup. Also, if most orders are paid, even an index beginning with `status` may not be useful for `SELECT *`; a table scan may still be cheaper.

---

## 35. A practical index-design method

For each important query, examine:

1. **Equality predicates**

   ```sql
   customer_id = 781
   status = 'paid'
   ```

2. **Range predicates**

   ```sql
   created_at >= ...
   price BETWEEN ... AND ...
   ```

3. **Required ordering**

   ```sql
   ORDER BY created_at DESC
   ```

4. **Selected columns**

   ```sql
   SELECT id, created_at, total
   ```

5. **Expected number of matching rows**

   Ten rows and ten million rows lead to different plans.

6. **Write frequency**

   A read optimization may impose substantial write cost.

7. **Existing indexes**

   A new index may duplicate or overlap an existing one.

A candidate key often places equality-constrained columns first, followed by the range or ordering columns. Then consider included columns only if covering the query provides enough value to justify the extra size.

Column order among multiple equality predicates still matters for query reuse, prefix queries, compression, statistics, and other workload patterns.

---

## 36. Common misconceptions

### “An indexed query is always fast”

Not if it returns much of the table, performs many random row fetches, encounters lock contention, or uses a poorly matching composite index.

### “A composite index indexes every column independently”

An index on `(a, b)` is one lexicographically ordered structure. It is not equivalent to separate indexes on `a` and `b`.

### “The most selective column must always be first”

Selectivity matters, but so do equality predicates, ranges, sorting, covering, compression, and the surrounding workload. It is not an absolute rule.

### “More indexes only improve reads”

Indexes can improve reads but increase storage and write costs.

### “Primary keys and unique constraints are separate from indexes”

They are logical constraints, but databases commonly enforce them with unique B-tree indexes or index-like structures.

### “B-tree means binary tree”

A B-tree page commonly has hundreds of children. Its high branching factor is one of its central advantages.

---

## 37. The core mental model

Think of a B-tree index as a sorted, multi-level directory:

```text
Root:
Which broad key region?

Internal page:
Which narrower region?

Leaf:
Where is the exact key or starting point?

Linked leaves:
Continue through the requested range.
```

For a composite index `(a, b, c)`, imagine a sorted sequence of tuples:

```text
(a1, b1, c1)
(a1, b1, c2)
(a1, b2, c1)
(a2, b1, c1)
```

A query uses that index efficiently when its desired rows occupy one or a few compact intervals in this sequence.

That single idea explains most B-tree behavior:

- Equality lookups identify a point or narrow interval.
- Range predicates identify a contiguous interval.
- Prefix searches work because they identify an interval.
- Leading wildcards usually fail because matches are scattered.
- Composite-index prefixes work because they preserve grouping.
- Sorting can be avoided when index order matches output order.
- Low-selectivity queries may be inefficient because the interval is too large.
- Covering indexes help because no second structure must be visited.

In short, B-tree indexes trade extra storage and write work for fast navigation through sorted data. Their power comes less from “having an index” than from choosing an ordering that matches the database’s important query patterns.
