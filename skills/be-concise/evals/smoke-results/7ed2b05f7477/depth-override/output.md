I’m applying the TLDR skill’s depth override: this will be detailed and explanatory, while keeping the prose focused.

# B-tree database indexes

A B-tree index is a sorted, balanced tree that lets a database find rows without scanning the entire table. Most database “B-tree” indexes are technically **B+ trees**: internal nodes guide the search, while leaf nodes contain every indexed key and are linked for efficient range scans.

## 1. Structure

A B-tree index is stored in fixed-size blocks called **pages**, commonly 8–16 KiB. Each page contains many sorted entries, so the tree is wide rather than deep.

```text
                         Root page
                    [ 30 | 60 | 90 ]
                   /      |      |      \
                  /       |      |       \
             < 30      30–59   60–89    >= 90
                \         \       \         \
             Leaf pages linked in sorted order
```

The tree has three kinds of pages:

- The **root page** is the search starting point.
- **Internal pages** contain separator keys and child-page pointers.
- **Leaf pages** contain indexed keys and row references.

A leaf entry for an index on `users(email)` might conceptually look like:

```text
("alice@example.com", row_pointer_417)
```

The row reference depends on the database and index type. It might be a physical tuple location, a primary-key value, or the row itself in a clustered index.

Leaf pages are usually connected as a doubly linked list:

```text
Leaf A <-> Leaf B <-> Leaf C <-> Leaf D
```

That linkage is what makes ordered and range operations efficient. After locating the first matching key, the database can move through neighboring leaf pages instead of repeatedly traversing the tree.

### Balanced means predictable depth

All leaf pages appear at roughly the same level. The database maintains this property as entries are inserted and removed.

Because each internal page can point to hundreds of children, even a huge index is shallow. Suppose one internal page has a fan-out of 400:

```text
Level 0:              1 root
Level 1:            400 pages
Level 2:        160,000 pages
Level 3:     64,000,000 pages
```

A tree with only three or four internal steps can therefore address billions of entries. Frequently accessed upper pages are usually cached, so a lookup may require only one or two physical storage reads.

## 2. How a lookup works

Consider this query:

```sql
SELECT *
FROM users
WHERE email = 'maya@example.com';
```

Assume there is an index on `email`.

### Step 1: Read the root

The database starts at the root and compares the requested value with its separator keys.

```text
Root: [ g | n | t ]
```

`maya@example.com` falls between `g` and `n`, so the database follows the corresponding child pointer.

### Step 2: Traverse internal pages

The chosen internal page contains a narrower set of separators:

```text
Internal page: [ j | l | m ]
```

The database selects another child. Searching within a page is typically done with binary search or a cache-conscious variation of it.

This continues until it reaches a leaf.

### Step 3: Search the leaf

The leaf contains sorted entries:

```text
...
luis@example.com
maya@example.com       -> row reference
mira@example.com
...
```

The database finds the entry and uses its reference to retrieve the row.

For a secondary index, fetching the row may require another lookup or random page access. PostgreSQL typically follows a heap tuple location; InnoDB secondary indexes contain the primary-key value and use it to look up the clustered row.

### Equality and range scans

Equality lookup stops after finding the matching entry or entries:

```sql
WHERE email = 'maya@example.com'
```

A range lookup finds its starting position and then walks the linked leaves:

```sql
WHERE created_at >= '2026-01-01'
  AND created_at <  '2026-02-01'
ORDER BY created_at;
```

The path looks like this:

```text
root -> internal page -> first matching leaf
                           |
                           v
                 leaf -> leaf -> leaf -> stop
```

This also supports ordered operations such as:

```sql
ORDER BY created_at
MIN(created_at)
MAX(created_at)
```

The optimizer may avoid a separate sort if the index order matches the requested order.

## 3. Composite indexes

A composite index sorts by several columns lexicographically:

```sql
CREATE INDEX idx_orders
ON orders (customer_id, created_at);
```

Its entries are ordered approximately like this:

```text
(101, 2026-01-03)
(101, 2026-01-12)
(101, 2026-02-04)
(102, 2025-12-20)
(102, 2026-01-08)
```

This index works well for:

```sql
WHERE customer_id = 101
```

and:

```sql
WHERE customer_id = 101
  AND created_at >= '2026-01-01'
```

It normally cannot perform a similarly precise tree lookup for `created_at` alone, because rows with a given date are scattered across every `customer_id` group. This is the basis of the **leftmost-prefix rule**.

After the database encounters a range condition, later index columns often become less useful for narrowing the tree traversal. They may still help filter rows or make the index cover the query.

## 4. Page splits

Pages have finite space. Eventually, an insertion targets a leaf that cannot hold another entry.

Suppose a simplified leaf can hold four keys:

```text
[10, 20, 30, 40]
```

Now insert `25`:

```text
[10, 20, 25, 30, 40]   -- too large
```

The database allocates a new page and divides the entries:

```text
Left leaf:  [10, 20]
Right leaf: [25, 30, 40]
```

It then updates the parent with a separator that distinguishes the pages:

```text
Parent: [... | 25 | ...]
               / \
       [10,20]   [25,30,40]
```

The exact choice of separator and which page retains which entries varies by implementation.

### Split propagation

The parent may also be full. Adding the new separator can force the parent to split. That split may propagate upward through several levels.

```text
leaf split
    |
    v
parent receives separator
    |
    v
parent split
    |
    v
grandparent receives separator
```

If the root splits, the database creates a new root pointing to the two resulting pages:

```text
Before:

          [large full root]

After:

             [separator]       <- new root
              /       \
       [left page]   [right page]
```

This is how the tree grows taller while remaining balanced.

### Why splits are expensive

A split may require the database to:

- Allocate a new page.
- Move entries between pages.
- Update sibling links.
- Modify the parent.
- Record changes in the write-ahead log.
- Coordinate concurrent readers and writers with page latches.
- Produce additional dirty pages that must later be flushed.

A single row insertion can therefore cause several index-page writes.

Databases use careful concurrency protocols so another transaction never follows a half-finished structural change. The implementation details differ, but short-lived page latches protect in-memory structures while transaction locks and MVCC handle logical concurrency.

### Sequential versus random insertions

An index on an increasing value, such as an auto-incrementing ID, directs new entries to the rightmost leaf. This gives good locality but may create contention because many writers target the same page.

Random keys, such as uniformly distributed UUIDv4 values, spread writes across the tree. That can reduce the single-page hotspot, but it tends to touch more pages, reduce cache locality, and create splits throughout the index.

A database may leave free space in pages to delay splits. PostgreSQL exposes this through an index `fillfactor`; other systems have related mechanisms. Lower page occupancy consumes more storage but gives future inserts room to land.

## 5. Deletion and rebalancing

Deleting an index entry can leave a page sparsely occupied. Classical B-tree algorithms redistribute entries between siblings or merge underfilled pages:

```text
Before:
[10]   [20, 30, 40]

After redistribution:
[10, 20]   [30, 40]
```

or:

```text
Before:
[10]   [20]

After merge:
[10, 20]
```

Production databases do not always rebalance immediately. Eager merging could turn every delete into several page modifications and create contention. Some engines leave partially empty pages in place and reclaim or compact them later.

MVCC adds another complication: deleting a row may not immediately remove its index entry because older transactions might still need to see the old row version. Cleanup processes later remove dead entries.

## 6. The main read/write trade-off

The central trade-off is simple: **indexes make selected reads faster by adding work to every relevant write**.

Without an index, this query may scan the full table:

```sql
SELECT *
FROM orders
WHERE customer_id = 417;
```

With an index, it can traverse a few tree levels and read only the matching entries. That can change the cost from examining millions of rows to examining a handful of pages.

But every write must maintain every affected index:

```sql
INSERT INTO orders ...
UPDATE orders SET customer_id = ...
DELETE FROM orders ...
```

For each relevant index, the database may need to:

- Locate the correct leaf.
- Insert or remove an entry.
- Split or compact pages.
- Generate additional transaction-log records.
- Hold more pages in memory.
- Flush more dirty data to storage.
- Perform more work during replication and recovery.

An `UPDATE` only needs to change a particular index if it changes an indexed value, although database-specific row-versioning rules can still create indirect index maintenance.

More indexes therefore mean:

```text
Faster indexed reads
        versus
Slower writes + more storage + more cache use
```

The trade-off is not “indexes are good for reads and bad for writes” in every case. An index can also make an `UPDATE` or `DELETE` faster by locating its target rows efficiently. The operation then pays the cost of maintaining the indexes after locating those rows.

## 7. Covering indexes

A query normally uses an index to find a row and then reads the table page containing the full row. That second access can be avoided when the index contains everything the query needs.

For example:

```sql
CREATE INDEX idx_orders_customer
ON orders (customer_id)
INCLUDE (status, total);
```

A query such as:

```sql
SELECT status, total
FROM orders
WHERE customer_id = 417;
```

may be answered from the index alone. This is an **index-only scan** or covering-index access.

The benefit is fewer table-page reads. The cost is a larger index: fewer entries fit per page, cache efficiency drops, writes move more bytes, and splits may occur more often.

## 8. When a B-tree is useful

B-tree indexes are especially effective for:

```sql
column = value
column < value
column BETWEEN low AND high
column IS NULL
ORDER BY column
MIN(column)
MAX(column)
```

Their usefulness falls when a query cannot exploit the stored ordering. Common examples include:

```sql
WHERE function(column) = value
WHERE text_column LIKE '%suffix'
WHERE second_column = value
```

The first can sometimes use an expression index, the second may need a full-text or specialized index, and the third may need a separate index when `second_column` is not the leading part of a composite key.

An index may also be ignored when a query returns a large fraction of the table. At that point, sequentially reading the table can be cheaper than traversing many index entries and performing scattered row fetches.

## 9. The complete lookup picture

For a typical secondary-index query, the work is:

```text
Search key
    |
    v
Root page
    |
    v
One or more internal pages
    |
    v
Leaf entry
    |
    v
Row reference or primary key
    |
    v
Table row
```

For a range query, the database continues sideways through linked leaves. For an insertion, it follows the same downward path, modifies the target leaf, and may split pages upward. That shared design—wide pages, shallow balanced height, and sorted linked leaves—is why B-trees provide predictable point lookups, efficient ranges, and acceptable update costs across very large datasets.
