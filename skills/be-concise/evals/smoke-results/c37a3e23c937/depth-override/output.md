# B-tree database indexes

Most database “B-tree” indexes are technically **B+ trees**: internal pages guide the search, while leaf pages contain every indexed key in sorted order. Leaf pages are also linked together, which makes both exact lookups and range scans efficient.

## 1. Structure

A B-tree index is stored in fixed-size blocks called **pages**—often 8–16 KB each. It usually has three levels:

```text
                         Root page
                    [ 20 | 50 | 80 ]
                    /     |     |    \
                   /      |     |     \
          Branch page  Branch  Branch  Branch
             ...         ...     ...     ...
              |           |       |       |
          Leaf pages linked in sorted order
       [1..9] <-> [10..19] <-> [20..29] <-> ...
```

Each internal-page entry contains:

```text
separator key → child page
```

For example:

```text
20 → child containing keys below 20
50 → child containing keys from 20 through 49
80 → child containing keys from 50 through 79
```

Exact boundary rules vary by database, but the principle is the same: separator keys tell the engine which child page could contain the requested value.

A leaf entry contains the indexed key and a way to find the row:

```text
indexed key → row location
```

The “row location” depends on the database and index type:

- In a secondary index, it may be a physical tuple identifier or the table’s primary key.
- In a clustered index, the leaf level may contain the actual row.
- In an index-only or covering query, the leaf entry may already contain every column the query needs.

Leaf pages are sorted and connected to adjacent leaf pages. Once the engine finds the first matching leaf entry, it can scan forward without returning to the root.

## 2. Why the tree is shallow

A binary tree has only two children per node. A database B-tree page can contain hundreds of child pointers because each page is several kilobytes.

Suppose one internal page can address 300 children:

- Level 1 addresses 300 leaf pages.
- Level 2 addresses 90,000 leaf pages.
- Level 3 addresses 27 million leaf pages.

That high **fan-out** means even a huge index is often only three or four pages deep. The root and upper branch pages are also frequently cached, so a lookup may require only one uncached leaf-page read.

Formally, lookup cost is approximately:

```text
O(log_f N)
```

Here, `f` is the page fan-out, which is much larger than two.

## 3. Exact lookup path

Consider this query:

```sql
SELECT *
FROM users
WHERE email = 'maya@example.com';
```

Assume there is an index on `email`.

The lookup proceeds as follows:

1. The engine reads the root page.
2. It compares the search key with the root’s separator keys.
3. It follows the pointer to the appropriate branch page.
4. It repeats the comparison at each branch level.
5. It reaches the one leaf page that could contain the key.
6. It searches within that page, usually with binary search or a page-specific optimized search.
7. If the key exists, it obtains the row location.
8. If required columns are absent from the index, it fetches the table row.

The last operation is often called a **table lookup**, **heap lookup**, or **bookmark lookup**. It can be relatively expensive when many rows match because those rows may be scattered across many table pages.

A covering index avoids that second lookup:

```sql
CREATE INDEX users_email_idx
ON users (email)
INCLUDE (name, status);
```

For a query needing only `email`, `name`, and `status`, the database may answer directly from the index. Syntax and visibility rules differ between database systems.

## 4. Range scans

B-trees are especially useful for ordered ranges:

```sql
SELECT *
FROM orders
WHERE created_at >= '2026-07-01'
  AND created_at <  '2026-08-01'
ORDER BY created_at;
```

The engine first descends the tree to find the earliest matching value. It then walks the linked leaf pages sequentially until it reaches the upper bound.

```text
Tree descent → first matching leaf entry
                         |
                         v
[June keys] <-> [July keys] <-> [August keys]
                    scan →
```

This is more efficient than performing a separate tree lookup for every row. Because entries are already ordered, the index may also satisfy `ORDER BY` without a separate sort.

The same property supports:

- Minimum and maximum lookups
- Prefix searches such as `LIKE 'maya%'`
- Ordered pagination
- Grouping in index order
- Composite-key range scans

A leading wildcard such as `LIKE '%maya'` normally cannot use an ordinary B-tree to locate the starting point because the beginning of the key is unknown.

## 5. Composite indexes

For this index:

```sql
CREATE INDEX orders_customer_date_idx
ON orders (customer_id, created_at);
```

Entries are ordered approximately like this:

```text
(customer_id, created_at)
```

First they are sorted by `customer_id`; within each customer, they are sorted by `created_at`.

It works well for:

```sql
WHERE customer_id = 42
```

and:

```sql
WHERE customer_id = 42
  AND created_at >= '2026-07-01'
```

It is usually less useful for:

```sql
WHERE created_at >= '2026-07-01'
```

The tree is not globally ordered by `created_at`; dates are divided into separate customer groups. This is the **leftmost-prefix** principle, though some engines can partially compensate with skip scans or other optimizations.

Column order therefore determines which queries can efficiently locate a narrow section of the tree.

## 6. Insertion

To insert a new index entry, the engine:

1. Traverses from the root to the target leaf page.
2. Inserts the key into its sorted position.
3. Updates transaction logs and concurrency metadata.
4. Splits the page if it lacks sufficient free space.
5. Propagates structural changes upward when necessary.

If the leaf still has room, insertion is local. The engine may need to move entries within the page, but it does not restructure the tree.

Concurrency makes the real implementation more involved. Databases use page latches, locks, optimistic protocols, or combinations of these to prevent concurrent searches and modifications from observing an invalid structure. Write-ahead logging ensures the change can be recovered after a crash.

## 7. Page splits

Suppose a leaf page is full:

```text
[10, 20, 30, 40, 50, 60]
```

The database needs to insert `35`. A simplified split looks like this:

```text
Before:
[10, 20, 30, 40, 50, 60] + 35

After:
[10, 20, 30, 35] <-> [40, 50, 60]
```

The engine allocates a new page, distributes entries between the old and new pages, repairs the leaf links, and inserts a separator into the parent:

```text
Parent gains:
40 → new right-hand page
```

The exact distribution is implementation-specific. Some engines aim for roughly half-full pages; others preserve extra space based on fill-factor settings or insertion patterns.

### Split propagation

The parent page itself may already be full. Adding the new separator can split the parent, requiring a separator to be added to its parent. This can continue toward the root.

If the root splits, the engine creates a new root:

```text
Before:

       [old root]

After:

       [new root]
        /      \
 [old half]  [new half]
```

This is how the tree grows taller while remaining balanced. Every leaf stays at the same depth, so no branch degenerates into a long chain.

### Why splits are expensive

A split can require:

- Allocating another page
- Moving many index entries
- Updating the parent
- Updating sibling links
- Writing additional transaction-log records
- Dirtying several cached pages
- Holding structural latches
- Propagating another split upward

Splits also leave pages partially empty, increasing the index’s storage footprint. Over time, repeated changes can create fragmentation or poor page density, though the practical effect and terminology vary by engine.

## 8. Sequential versus random inserts

Insertion order strongly affects split behavior.

For an increasing key such as an auto-incrementing integer, new entries usually go to the rightmost leaf page:

```text
... <-> [900, 901, 902, 903]
```

This produces mostly sequential growth and good locality. However, many concurrent writers may contend for the same final page, creating a hot spot.

Random keys—such as fully random UUIDs—send inserts throughout the tree. This spreads concurrent writes across pages but can cause more cache misses, mid-tree page splits, page churn, and reduced density.

Time-ordered UUID formats can provide uniqueness while preserving more insertion locality. Whether they are worthwhile depends on database support, workload, and exposure requirements.

A **fill factor** can reserve free space in index pages so future inserts are less likely to split them. The cost is a larger index immediately, fewer entries per page, and potentially more reads.

## 9. Updates and deletes

Updating an indexed column is often equivalent to:

1. Removing the old index entry.
2. Inserting a new entry at a different sorted location.

Updating a non-indexed column may still affect indexes that include that column or whose leaf entries contain the full row.

Deletion usually marks or removes an entry, but the database may defer physical cleanup because of active transactions or MVCC visibility rules. Underfull pages can sometimes be merged or reused, although databases differ in how aggressively they do this.

Unlike insertion, deletion normally does not require immediately shrinking the entire tree. A tree can remain structurally valid while using space inefficiently.

## 10. The main read/write trade-off

An index spends storage and write work to save read work.

Without an appropriate index, the database may scan every table page:

```text
Read cost: roughly proportional to table size
```

With a selective B-tree index, it can descend a few levels and inspect only the relevant leaf entries:

```text
Read cost: tree descent + matching entries + possible row fetches
```

The price is paid on writes. Every insert, delete, or relevant update must maintain each affected index. More indexes mean:

- More pages written
- More transaction-log volume
- More cache pressure
- More locking or latching work
- More opportunities for page splits
- More disk space
- Longer maintenance, backup, and recovery operations

An index is most valuable when it sharply reduces the number of rows examined or provides useful ordering. An index on a low-selectivity column such as a boolean may offer little benefit when half the table matches, though it can still help in combination with other columns, for rare values, or through filtered and partial indexes.

Wide indexes can cover more queries, but each entry becomes larger. Larger entries reduce fan-out, fit fewer records on each leaf page, consume more cache, and amplify write cost.

The practical goal is not to index every searchable column. It is to maintain the smallest set of indexes that supports the important query patterns.

## 11. One complete example

Given:

```sql
CREATE INDEX payments_account_time_idx
ON payments (account_id, created_at);
```

and:

```sql
SELECT amount
FROM payments
WHERE account_id = 812
  AND created_at >= '2026-07-01'
ORDER BY created_at;
```

The engine can:

1. Descend through separator keys to the first leaf entry at or after `(812, '2026-07-01')`.
2. Scan forward through adjacent leaf pages.
3. Stop when `account_id` changes from `812`.
4. Return rows in `created_at` order without sorting.
5. Fetch each underlying table row to obtain `amount`, unless `amount` is stored in the index.

Adding `amount` as an included column could remove those table fetches, improving this read. It would also enlarge every index entry and make inserts and relevant updates more expensive. That is the B-tree trade-off in its most common form: **extra ordered data and maintenance work on writes buy faster, narrower, already-sorted reads.**
