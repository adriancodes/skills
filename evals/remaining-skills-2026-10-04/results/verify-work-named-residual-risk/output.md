I’m applying the supplied verify-work skill to the quoted-comma preservation promise, using inline probes and leaving all files unchanged.

The scoped promise is: every surviving quoted field containing a comma retains its exact bytes. I’ll test spacing, escaped quotes, embedded newlines, Unicode, and value-like text within those fields; row counts and error handling remain out of scope.

Verification failed. Mode: read-only; no files modified.
- Executed reproducer: `id,value\n1,"x, y"\n` outputs `id,value\n1,"x,y"\n`, deleting a byte inside the quoted field. Spaces, tabs, and U+FEFF near commas are stripped by `.trim()`.
- Executed reproducer: `id,value\n1,"x,\r\ny"\n` outputs `id,value\n1,"x,\ny"\n`, changing embedded CRLF bytes.

Inline probes executed the unchanged script with in-memory input. Four fresh rounds reached two consecutive rounds with no new defect classes; existing failures remain.
Residual scope: empty-file handling, row counts, malformed-input rejection, invocation errors, and all behavior beyond quoted-comma preservation were excluded. No applicable catalog class remained untested.