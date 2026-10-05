A B-tree database index keeps keys sorted in a balanced tree of storage pages, so the database can find a value or a range without scanning every row. Its main trade-off is that faster reads require extra storage and maintenance on writes. Most database indexes described as “B-tree” use a B+ tree layout: internal pages direct searches, while leaf pages hold the indexed entries. Exact page layouts vary by database, but the underlying behavior is similar.

**The structure**

Think of an index on a table’s `customer_id` column. The index organizes those values into pages, usually a few kilobytes each, rather than creating a separate tree node for each value.

The tree has three kinds of pages. The root is the entry point. Internal pages contain separator keys and references to child pages. Leaf pages contain sorted index entries, including enough information to locate the corresponding row. A small index can fit entirely in one page, which serves as both root and leaf.

For example, a root might contain separator keys `40` and `80`. Conceptually, its three child references lead to values below `40`, values from `40` up to `80`, and values at or above `80`. Each child can repeat that routing structure until the search reaches a leaf. The precise boundary convention is an implementation detail.

The important feature is *fan-out*: each internal page can point to many children. A binary search tree has two children per node; a B-tree page can have hundreds, depending on page size and key width. That makes the tree shallow. With an illustrative fan-out of 200, a root and two more levels can address roughly eight million leaf entries if each leaf also holds about 200 entries.

All leaves sit at the same depth. “Balanced” means the lookup path stays short across the key space; it does not mean every page must be equally full.

**The lookup path**

For a query such as:

```sql
SELECT * FROM orders WHERE customer_id = 57;
```

the database starts at the root, compares `57` with its separator keys, and follows the appropriate child reference. It repeats this process on each internal page until it reaches a leaf, then searches that leaf for matching entries.

This has two distinct costs: searching within each page and accessing the pages along the path. Implementations use efficient searches within a page; fetching an uncached page from storage is typically much more expensive than comparing keys already in memory. Root and upper-level pages are frequently cached because many lookups reuse them.

Finding an index entry does not always finish the query. In an index stored separately from table rows, the entry supplies a row locator, and the database must fetch the row from the table. If many matches point to scattered table pages, those additional accesses can dominate the cost.

A covering index contains the columns needed by the query, potentially allowing the database to answer from the index. Whether it can avoid all table access also depends on the database’s visibility rules. In a clustered organization, leaf pages can contain the table rows themselves.

For a range query, the database first descends to the beginning of the range:

```sql
SELECT * FROM orders
WHERE customer_id BETWEEN 57 AND 72;
```

It then walks through consecutive leaf entries until it passes the upper bound. B+ tree leaves are typically linked, which makes continuing across pages efficient. The database pays for the initial descent once, then scans the relevant part of the index. This sorted layout also helps with ordering and finding minimum or maximum values.

**Inserts and page splits**

An insert first follows the same search path to find the leaf where the new key belongs. If that page has enough space, the database inserts the entry in sorted order. It may need to rearrange bytes within the page, but no tree restructuring is necessary.

If the page cannot accommodate the entry, the database splits it. It allocates another page, redistributes entries between the old and new pages, and updates their leaf links. It then adds a separator key and a child reference to the parent so future searches can reach both pages.

Suppose a leaf contains:

```text
10, 20, 30, 40
```

and, in this simplified example, has room for only four entries. Inserting `25` might produce:

```text
Left leaf:   10, 20
Right leaf:  25, 30, 40
```

The parent receives a separator identifying the right leaf’s key range. Real databases measure capacity in bytes, so variable-length keys affect whether a page fits. They may also choose split boundaries based on insertion patterns instead of dividing entries exactly in half.

The parent can become full when it receives that new separator. If so, it splits too, and the change propagates upward. A root split creates a new root with references to the two resulting pages, increasing the tree’s height by one. Every leaf remains at the same depth.

A split therefore costs more than an ordinary insert: it allocates a page, moves entries, changes routing information, and usually creates additional recovery-log records. Most inserts do not cause splits, but split-heavy workloads can have uneven write latency.

Key order matters. Increasing keys concentrate inserts near the rightmost leaf, often improving locality while potentially creating contention among concurrent writers. Random keys spread inserts across more pages, increasing cache pressure and scattered page access. Neither pattern removes index-maintenance costs.

Deletes remove entries or mark them for later cleanup. Depending on the implementation, underfilled pages may be merged or reclaimed immediately or during later maintenance. Updating an indexed key generally requires removing its old entry and inserting its new one.

**The main read/write trade-off**

The read benefit comes from maintaining sorted access paths in advance. Instead of inspecting every table row, the database can navigate to a small subset, scan a range in order, or sometimes answer directly from an index.

The write cost comes from preserving those access paths whenever data changes. Every insert must maintain each applicable index. Deletes and updates can require index work too, alongside logging, page access, and occasional splits. Index pages also consume disk space and compete with table pages for memory.

Wider keys make this trade-off sharper. Fewer entries fit on each page, so the index requires more pages and may need more levels. Adding columns to cover a query can eliminate expensive row fetches, but it also enlarges the index and increases maintenance work.

An index is most valuable when it substantially reduces the data a query must touch. If a query needs a large fraction of a table, scanning the table can be cheaper than reading many index entries and fetching their rows individually. The optimizer chooses between these paths using estimates of matching rows and access costs.

For example, an index on `customer_id` can make retrieving one customer’s orders much faster. It also means every new order requires another index entry. Adding several more indexes may speed up other queries, but every insert must maintain those structures as well. The practical design decision is whether the read savings justify the storage, memory, and write work for the actual workload.