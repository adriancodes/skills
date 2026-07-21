# B-tree indexes, step by step

A B-tree index is a sorted, balanced data structure that databases use to find rows without scanning an entire table.

Suppose a table contains 10 million customers:

```sql
CREATE TABLE customers (
    id         BIGINT PRIMARY KEY,
    email      TEXT,
    last_name  TEXT,
    created_at TIMESTAMP
);
```

Without an index, this query may inspect every row:

```sql
SELECT *
FROM customers
WHERE email = 'ada@example.com';
```

That is a **table scan**: potentially 10 million comparisons.

With an index:

```sql
CREATE INDEX customers_email_idx
ON customers (email);
```

the database navigates a short tree to locate the matching entry, often requiring only a handful of page reads.

---

## 1. Start with a sorted array

Imagine indexing these customer IDs:

```text
3, 8, 12, 17, 23, 31, 44, 58, 71, 90
```

A sorted array supports binary search:

1. Examine the middle value.
2. Decide whether the target is to its left or right.
3. Repeat on that half.

Finding `71` takes far fewer comparisons than checking every value.

But a large sorted array has a weakness: inserting a value may require shifting many later values. If we insert `20`, everything after its position might need to move.

A B-tree preserves sorted search while dividing the data into manageable blocks called **nodes** or, in database storage, **pages**.

---

## 2. A B-tree node holds many values

A binary search tree might store one key per node:

```text
        31
       /  \
     12    58
```

A B-tree node stores many keys:

```text
[12 | 31 | 58]
```

Those keys divide possible values into ranges:

```text
child 0: values < 12
child 1: 12 <= values < 31
child 2: 31 <= values < 58
child 3: values >= 58
```

A small conceptual tree could look like this:

```text
                    [31 | 58]
                   /    |     \
                  /     |      \
 [3 | 8 | 12 | 17 | 23] [31 | 44] [58 | 71 | 90]
```

The top node is the **root**. The bottom nodes are **leaves**.

Real database pages contain many more entries—often hundreds—so the tree has a very high branching factor.

---

## 3. Why database B-trees are shallow

Databases read storage in pages, commonly 8 KiB or 16 KiB at a time. A B-tree is designed so that each node fits into approximately one page.

Suppose an internal page can reference 300 child pages:

- Level 1 can lead to about `300` pages.
- Level 2 can lead to about `300² = 90,000` pages.
- Level 3 can lead to about `300³ = 27,000,000` pages.
- Level 4 can lead to about `8.1 billion` pages.

Therefore, even an enormous index may be only three or four levels deep.

This is the central advantage: each page read eliminates a huge portion of the search space.

---

## 4. What an index entry contains

For this index:

```sql
CREATE INDEX customers_email_idx
ON customers (email);
```

a simplified leaf entry looks like:

```text
("ada@example.com", row location)
```

The row location identifies the corresponding table row. Depending on the database and table organization, it might be:

- A physical tuple or page identifier.
- The table’s primary key.
- A logical row identifier.
- The entire row, when the index is clustered or covering.

The index is not usually a second complete copy of the table. It is a sorted collection of indexed keys plus enough information to locate rows.

A leaf might conceptually contain:

```text
[
  ("ada@example.com", row 901),
  ("ben@example.com", row 417),
  ("cara@example.com", row 638)
]
```

---

## 5. Exact lookup

Consider:

```sql
SELECT *
FROM customers
WHERE email = 'cara@example.com';
```

Suppose the index is:

```text
                           [m@example.com]
                         /                 \
        [d@example.com | h@example.com]   [r@example.com]
          /          |          \          /          \
       leaf A      leaf B      leaf C    leaf D      leaf E
```

The database proceeds roughly as follows:

1. Read the root.
2. Compare `'cara@example.com'` with `'m@example.com'`.
3. Since `cara < m`, follow the left pointer.
4. Compare it with the separator keys `d` and `h`.
5. Since `cara < d`, follow the first pointer.
6. Search the selected leaf for the exact key.
7. Retrieve the row location.
8. Read the table row if the required data is not already in the index.

This is often described as an `O(log n)` search, but B-trees perform especially well because the logarithm’s base—the branching factor—is large.

---

## 6. Range lookup

B-tree indexes are not merely lookup maps. Because their leaf entries are sorted, they are excellent for ranges:

```sql
SELECT *
FROM customers
WHERE created_at >= '2026-07-01'
  AND created_at <  '2026-08-01';
```

With:

```sql
CREATE INDEX customers_created_at_idx
ON customers (created_at);
```

the database can:

1. Descend the tree to the first entry at or after July 1.
2. Read entries sequentially.
3. Stop when it reaches August 1.

Conceptually:

```text
... June 29, June 30, July 1, July 2, ..., July 31, August 1 ...
                       ^                              ^
                     start                           stop
```

The initial tree descent finds the starting point. After that, the database scans neighboring leaf entries.

Most database B-tree implementations link adjacent leaf pages:

```text
leaf A <-> leaf B <-> leaf C <-> leaf D
```

That makes ordered range scans efficient.

---

## 7. B-tree versus B+ tree

Database indexes commonly use a variation called a **B+ tree**, although databases and documentation often call it simply a B-tree.

The typical distinction is:

- Internal nodes contain separator keys and child pointers.
- Leaf nodes contain the actual indexed entries.
- Leaf nodes are linked in sorted order.

Conceptually:

```text
Internal level:
                    [31 | 58]
                   /    |     \

Leaf level:
[3, 8, 12, 17, 23] <-> [31, 44] <-> [58, 71, 90]
```

Keeping actual entries in leaves provides predictable lookup behavior and makes sequential range scans straightforward.

Exact implementation details vary between database engines.

---

## 8. Insertion

Suppose a leaf can hold at most four keys:

```text
[10 | 20 | 30 | 40]
```

Now insert `25`.

The database first locates the correct leaf:

```text
[10 | 20 | 25 | 30 | 40]
```

The leaf is over capacity, so it splits:

```text
[10 | 20]    [25 | 30 | 40]
```

A separator is inserted into the parent so that future searches know which child to follow:

```text
              [25]
             /    \
     [10 | 20]    [25 | 30 | 40]
```

If the parent is also full, it may split too. Splitting can propagate upward.

If the root splits, the tree gains a new root and becomes one level taller.

### Larger insertion example

Start with:

```text
                       [30 | 60]
                      /    |     \
        [10 | 20]  [30 | 40 | 50]  [60 | 70]
```

Insert `45`:

```text
[30 | 40 | 45 | 50]
```

If four entries exceed the leaf’s limit, split it:

```text
[30 | 40]    [45 | 50]
```

Then add `45` as a separator in the parent:

```text
                     [30 | 45 | 60]
                    /    |    |    \
         [10 | 20] [30 | 40] [45 | 50] [60 | 70]
```

The precise choice of separator and split point depends on the implementation.

---

## 9. Why the tree remains balanced

A B-tree enforces occupancy rules:

- Nodes may hold multiple keys.
- Non-root nodes must generally remain at least partially full.
- All leaves stay at the same depth.

“All leaves stay at the same depth” is important. It prevents a tree from degenerating into a long linked list.

Compare:

```text
Unbalanced:
1
 \
  2
   \
    3
     \
      4
```

with:

```text
Balanced:
      [3]
     /   \
 [1 | 2] [3 | 4]
```

Search time remains predictable because every route from the root to a leaf has the same length.

---

## 10. Deletion

Suppose a leaf contains:

```text
[10 | 20 | 30]
```

Deleting `20` is easy:

```text
[10 | 30]
```

But deleting values can leave a node below its minimum occupancy. The database may then:

1. Borrow an entry from a neighboring node, or
2. Merge the underfull node with a neighbor.

Example:

```text
Before:
          [30]
         /    \
 [10 | 20]    [30 | 40]
```

After enough deletions, the left node might become too empty:

```text
          [30]
         /    \
       [10]   [30 | 40]
```

The implementation could rebalance entries or merge the nodes.

Database engines may also delay some cleanup for concurrency or MVCC reasons. The abstract algorithm describes immediate rebalancing, while production storage engines often use more nuanced maintenance strategies.

---

## 11. Multi-column indexes

Consider:

```sql
CREATE INDEX orders_customer_status_idx
ON orders (customer_id, status);
```

Entries are sorted lexicographically, like words in a dictionary:

```text
(100, 'cancelled')
(100, 'pending')
(100, 'shipped')
(101, 'pending')
(101, 'shipped')
(102, 'cancelled')
```

The first column is compared first. The second column breaks ties.

This index is naturally useful for:

```sql
WHERE customer_id = 100
```

and:

```sql
WHERE customer_id = 100
  AND status = 'pending'
```

It is usually much less useful for:

```sql
WHERE status = 'pending'
```

Why? All entries for one `customer_id` are grouped together, but all `'pending'` entries are scattered across the different customer groups.

This is often called the **leftmost-prefix rule**.

For an index on:

```text
(a, b, c)
```

the sorted order naturally supports prefixes such as:

```text
(a)
(a, b)
(a, b, c)
```

It does not naturally provide a global ordering by `b` or `c`.

---

## 12. Equality followed by a range

Suppose we have:

```sql
CREATE INDEX events_account_time_idx
ON events (account_id, occurred_at);
```

This query is an excellent match:

```sql
SELECT *
FROM events
WHERE account_id = 42
  AND occurred_at >= '2026-07-01'
  AND occurred_at <  '2026-08-01';
```

The relevant portion of the index is contiguous:

```text
(41, ...)
(42, June 30)
(42, July 1)   <- start
(42, July 2)
...
(42, July 31)
(42, August 1) <- stop
(43, ...)
```

The database can locate `(42, July 1)` and scan until `(42, August 1)`.

Column order matters. An index on:

```text
(occurred_at, account_id)
```

is sorted primarily by time, so entries for account `42` are mixed with entries for all other accounts within the time range.

A useful general pattern is:

```text
equality columns first, then range or ordering columns
```

That is a heuristic rather than an absolute rule; selectivity, query frequency, ordering needs, and database-specific optimizer behavior also matter.

---

## 13. Ordering and avoiding a sort

An index can sometimes supply rows in the order requested:

```sql
CREATE INDEX posts_created_at_idx
ON posts (created_at);
```

Then:

```sql
SELECT *
FROM posts
ORDER BY created_at
LIMIT 20;
```

may scan the beginning or end of the index instead of:

1. Reading all qualifying rows.
2. Sorting them.
3. Returning the first 20.

A descending scan may support:

```sql
ORDER BY created_at DESC
```

even if the index was declared in ascending order, depending on the engine and the complete ordering requirements.

Composite ordering is more subtle. Given:

```sql
CREATE INDEX messages_idx
ON messages (conversation_id, sent_at);
```

this query aligns well:

```sql
SELECT *
FROM messages
WHERE conversation_id = 10
ORDER BY sent_at;
```

Once `conversation_id` is fixed, entries for that conversation are already ordered by `sent_at`.

---

## 14. Covering indexes

Suppose the query is:

```sql
SELECT customer_id, status
FROM orders
WHERE customer_id = 100;
```

and the index is:

```sql
CREATE INDEX orders_customer_status_idx
ON orders (customer_id, status);
```

Both requested columns are already present in the index. The database may be able to answer the query using only index pages. This is an **index-only scan**, and the index is said to **cover** the query.

Some databases support explicitly included columns:

```sql
CREATE INDEX orders_customer_idx
ON orders (customer_id)
INCLUDE (status, total);
```

Here:

- `customer_id` participates in searching and sorting.
- `status` and `total` are stored in leaf entries.
- Included columns generally do not determine the tree’s search order.

This could cover:

```sql
SELECT status, total
FROM orders
WHERE customer_id = 100;
```

Covering indexes reduce table lookups, but make the index larger and more expensive to maintain.

---

## 15. Clustered and nonclustered organization

The exact terminology varies by database.

### Nonclustered or secondary index

A secondary index usually stores:

```text
indexed key -> row locator or primary key
```

Finding a row may require:

1. Navigating the secondary index.
2. Obtaining the row locator.
3. Navigating to or reading the table row.

### Clustered index

In a clustered organization, table rows themselves are stored according to the clustered key, or the clustered B-tree’s leaf level contains the complete rows.

Only one physical ordering can dominate the table, so there is generally only one clustered organization.

Clustering makes nearby key values more likely to correspond to nearby stored rows, which can make range reads efficient. But inserting values into the middle of densely packed pages may cause page splits or fragmentation.

---

## 16. Primary keys and secondary indexes

In engines where the table is organized by primary key, consider:

```sql
PRIMARY KEY (id)
INDEX (email)
```

The secondary index may conceptually contain:

```text
(email, id)
```

To retrieve the full row by email:

1. Search the email index.
2. Get the associated primary key.
3. Search the primary-key tree for the full row.

This explains why large primary keys can increase the size of every secondary index in some database engines.

---

## 17. Duplicate values

B-tree keys do not have to be unique:

```sql
CREATE INDEX employees_department_idx
ON employees (department);
```

Many rows can have:

```text
department = 'Sales'
```

Conceptually, the leaves contain:

```text
('Sales', row 17)
('Sales', row 29)
('Sales', row 83)
```

The row locator makes each physical entry distinguishable.

For:

```sql
WHERE department = 'Sales'
```

the database finds the first matching entry and scans adjacent entries until the key changes.

A unique index adds a constraint:

```sql
CREATE UNIQUE INDEX users_email_uq
ON users (email);
```

During insertion, the database checks whether the key already exists and rejects a conflicting value, subject to the database’s rules for `NULL`.

---

## 18. Selectivity

An index is not automatically useful merely because it contains the queried column.

Consider a table with 100 million rows and:

```sql
WHERE active = TRUE
```

If 95 million rows are active, using an index on `active` may require:

- Traversing the index.
- Reading 95 million index entries.
- Performing millions of table-row lookups.

A sequential table scan may be faster.

If only 100 rows are active, the same index could be extremely effective.

**Selectivity** describes how narrowly a condition filters the table. Highly selective conditions tend to benefit more from an index.

The query optimizer estimates costs and decides whether to use:

- A table scan.
- An index scan.
- An index-only scan.
- A bitmap strategy.
- A combination of multiple indexes.
- Another access method.

Having an index does not force the database to use it.

---

## 19. Random row lookups can be expensive

Suppose an index finds one million matching entries, but the corresponding rows are scattered throughout the table.

The access pattern might resemble:

```text
index page -> table page 900
index page -> table page 12
index page -> table page 7004
index page -> table page 83
...
```

This can produce many random page accesses.

By contrast, a table scan reads pages in physical sequence. Even though it inspects more rows, sequential reads and cache-friendly processing may make it cheaper.

This is why optimizers may switch from index access to a table scan once the expected result set becomes sufficiently large.

---

## 20. Page splits and write cost

Indexes accelerate reads by maintaining extra structures. Every relevant write has additional work.

For an insertion:

```sql
INSERT INTO customers (...);
```

the database may need to:

1. Insert the table row.
2. Update the primary-key index.
3. Update the email index.
4. Update the last-name index.
5. Update the creation-time index.
6. Split pages if necessary.
7. Record changes in its transaction log.

For an update:

```sql
UPDATE customers
SET email = 'new@example.com'
WHERE id = 42;
```

the email index may require removal of the old entry and insertion of the new one.

For a deletion, every index entry associated with the row must eventually be removed or marked obsolete.

Therefore, indexes trade:

- More storage.
- More write work.
- More cache consumption.
- More maintenance.

for faster access to particular query patterns.

---

## 21. Sequential versus random keys

Compare two primary-key patterns.

Sequential IDs:

```text
1001, 1002, 1003, 1004, ...
```

Most new values are inserted near the right edge of the tree.

Random identifiers:

```text
8f2..., 13a..., c91..., 472..., ...
```

Insertions are distributed throughout the tree.

Sequential keys can improve locality and reduce widespread page splits, although they can create contention on the rightmost pages under high concurrency.

Random keys spread writes but may:

- Touch more pages.
- Reduce cache locality.
- Increase fragmentation or page splitting.
- Produce larger keys, depending on representation.

The best choice depends on concurrency, distribution requirements, storage engine, and workload.

---

## 22. Prefix matching

A B-tree index on `last_name` can often help with:

```sql
WHERE last_name = 'Smith'
```

and:

```sql
WHERE last_name >= 'Smith'
  AND last_name < 'Smiti'
```

It may also help with a prefix pattern:

```sql
WHERE last_name LIKE 'Smi%'
```

because matching strings occupy a contiguous range in the sorted index.

It generally cannot directly seek for:

```sql
WHERE last_name LIKE '%mith'
```

The leading wildcard means the beginning of the string is unknown. Values ending in `mith` are scattered throughout the normal alphabetical ordering.

Specialized indexes, reverse-string indexes, trigram indexes, or full-text search may be more appropriate, depending on the requirement.

Collation and database-specific pattern-matching rules can affect whether an index is usable.

---

## 23. Functions can block ordinary index use

Suppose we have:

```sql
CREATE INDEX users_email_idx
ON users (email);
```

This query may not use it as a normal direct lookup:

```sql
WHERE LOWER(email) = 'ada@example.com'
```

The tree is ordered by `email`, not necessarily by `LOWER(email)`.

Possible solutions include an expression index:

```sql
CREATE INDEX users_lower_email_idx
ON users (LOWER(email));
```

or storing a normalized form.

Now the indexed expression matches the query:

```sql
WHERE LOWER(email) = 'ada@example.com'
```

Similar issues arise with:

```sql
WHERE YEAR(created_at) = 2026
```

A range predicate often matches a plain timestamp index better:

```sql
WHERE created_at >= '2026-01-01'
  AND created_at <  '2027-01-01'
```

---

## 24. Partial or filtered indexes

If queries repeatedly target a small subset, some databases support partial indexes:

```sql
CREATE INDEX jobs_pending_idx
ON jobs (created_at)
WHERE status = 'pending';
```

Only pending jobs are indexed.

This can make the index:

- Smaller.
- Cheaper to scan.
- Cheaper to cache.
- Better aligned with queries such as:

```sql
SELECT *
FROM jobs
WHERE status = 'pending'
ORDER BY created_at
LIMIT 100;
```

The optimizer must be able to determine that the query satisfies the index predicate.

---

## 25. `NULL` and collation

Sorted order is more complicated than raw bytes.

An index’s ordering can depend on:

- Ascending versus descending direction.
- Whether `NULL` sorts first or last.
- Text collation.
- Case and accent sensitivity.
- Data type comparison rules.
- Locale.

For example, a linguistic collation may treat uppercase, lowercase, or accented characters differently from a binary comparison.

These rules affect equality, ranges, uniqueness, and whether the index ordering satisfies an `ORDER BY`.

---

## 26. Concurrency

Many transactions may search and modify a B-tree simultaneously.

The storage engine must coordinate:

- Readers traversing nodes.
- Writers inserting into leaves.
- Page splits.
- Parent updates.
- Transaction visibility.
- Crash recovery.

A simplistic implementation could lock the whole tree for every write, but that would severely limit concurrency. Production engines use techniques such as:

- Fine-grained page latches.
- Special split protocols.
- Write-ahead logging.
- Version visibility rules.
- Optimistic or lock-coupled traversal.

These details differ considerably among database engines, but the logical tree seen by queries remains sorted and searchable.

---

## 27. B-tree complexity

At a high level:

| Operation | Typical complexity |
|---|---:|
| Exact search | `O(log n)` |
| Insert | `O(log n)` |
| Delete | `O(log n)` |
| Find range start | `O(log n)` |
| Return `k` range entries | `O(log n + k)` |

The constants matter. A B-tree reduces costly storage operations by processing many keys per page.

If the root and upper levels remain cached in memory, a lookup may require only one or two reads from deeper pages.

---

## 28. A complete query example

Assume:

```sql
CREATE TABLE payments (
    id          BIGINT PRIMARY KEY,
    account_id  BIGINT NOT NULL,
    status      TEXT NOT NULL,
    paid_at     TIMESTAMP NOT NULL,
    amount      DECIMAL(12, 2) NOT NULL
);
```

The application frequently runs:

```sql
SELECT paid_at, amount
FROM payments
WHERE account_id = 700
  AND status = 'settled'
  AND paid_at >= '2026-01-01'
  AND paid_at <  '2026-02-01'
ORDER BY paid_at;
```

A plausible index is:

```sql
CREATE INDEX payments_lookup_idx
ON payments (account_id, status, paid_at)
INCLUDE (amount);
```

Its leaf entries are conceptually ordered like:

```text
(699, 'settled', ...)
(700, 'failed', ...)
(700, 'settled', 2025-12-31, amount)
(700, 'settled', 2026-01-01, amount)  <- seek here
(700, 'settled', 2026-01-02, amount)
...
(700, 'settled', 2026-02-01, amount)  <- stop here
(701, ...)
```

The execution can be:

1. Traverse the root and internal pages.
2. Seek to `(700, 'settled', 2026-01-01)`.
3. Scan leaf entries in order.
4. Stop at `(700, 'settled', 2026-02-01)`.
5. Return `paid_at` and included `amount`.
6. Potentially avoid reading the base table.
7. Potentially avoid a separate sort.

One index supports filtering, range scanning, ordering, and query coverage.

The tradeoff is that every payment insertion must also update this relatively wide index.

---

## 29. When a B-tree is a poor fit

B-trees are excellent for:

- Equality.
- Inequalities.
- Ranges.
- Prefixes of composite keys.
- Ordered retrieval.
- Minimum and maximum values.
- Prefix text matching in compatible collations.

They are less naturally suited to:

- Full-text relevance searches.
- Substring searches such as `'%abc%'`.
- Geospatial proximity.
- Similarity or nearest-neighbor vector search.
- Containment within arrays or documents.
- Very low-selectivity predicates.
- Queries that transform the indexed value incompatibly.

Other index types exist for these workloads, such as inverted, hash, spatial, trigram, bitmap, GIN/GiST-like, or vector indexes.

---

## 30. How to design an index

Begin with actual queries, not isolated columns.

For each important query, identify:

1. Equality predicates:

   ```sql
   account_id = ?
   status = ?
   ```

2. Range predicates:

   ```sql
   created_at >= ?
   ```

3. Required ordering:

   ```sql
   ORDER BY created_at
   ```

4. Returned columns:

   ```sql
   SELECT amount, created_at
   ```

5. Expected number of matching rows.

6. Read frequency versus write frequency.

7. Whether an existing index already has a useful prefix.

A candidate might place:

```text
equality keys -> range/order keys -> optional included columns
```

Then verify it using the database’s execution-plan facility, such as `EXPLAIN`, ideally with representative data.

Do not assume that syntactically plausible means efficient. Data distribution determines whether the optimizer considers an index worthwhile.

---

## 31. The core mental model

Think of a B-tree index as a sorted directory:

```text
Root:
    Which broad range?

Internal page:
    Which narrower range?

Leaf:
    Here are the sorted keys and row locations.

Neighboring leaves:
    Continue here for the rest of the range.
```

Its effectiveness comes from four properties:

1. **Sorted keys** support equality, ranges, and ordering.
2. **High branching factor** keeps the tree shallow.
3. **Balanced leaves** make lookup cost predictable.
4. **Page-sized nodes** align the structure with database storage.

The practical tradeoff is equally important:

> A B-tree makes selected reads faster by consuming storage and adding work to every relevant write.
