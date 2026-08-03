# In-app notifications — spec (fixture extract)

Confirmed decisions:

1. Notifications live in an in-memory store (`src/notifications.js`); persistence is out of scope for this fixture.
2. A notification is unread while `read_at` is `null`; the bell badge in the main app renders the unread count.
3. Marking a notification read sets `read_at` to an ISO-8601 timestamp; marking an unknown id throws.
4. Mark-all-read sweeps every unread notification in one call (slice 3 territory).
