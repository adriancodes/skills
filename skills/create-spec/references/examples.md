# Worked example

> **Q (via option UI):** Where should notification state live?
> 1. **New `notifications` table (recommended)**: survives restarts; the poller needs durable cursor state anyway.
> 2. **Redis**: no migration and the cheapest writes; right when losing unread state on a cache restart is acceptable.
>
> **User picks 1.** Append immediately: `3. **Storage**: new notifications table. _Why:_ the user chose durability across restarts.`
>
> **Next turn's probe:** "A user has 40,000 unread notifications: does the bell show 40000, 99+, or cap the query?" **User:** "Cap at 99+."
>
> **Append that decision immediately:** `4. **Unread badge**: cap at 99+. _Why:_ the user selected the display boundary for large unread counts.`
