I’m applying the supplied verify-work skill to quoted comma fields only, using inline probes and leaving all files unchanged.

The byte-for-byte preservation promise fails.
- Reproducer: `id,value\n1,"x, y"\n` outputs `id,value\n1,"x,y"\n`, removing whitespace inside the quoted field.
- Reproducer: `id,value\n1,"x,\r\ny"\n` outputs `id,value\n1,"x,\ny"\n`, changing CRLF inside the quoted field.
Executed 16 inline probes across three fresh rounds; the last two found no new failure classes, satisfying the two-dry-round discovery bar. Both defects remain.
Authority: read-only; no files modified or patches applied. All applicable scoped catalog attacks were covered; unrelated behavior was excluded.