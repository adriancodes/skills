# Example: Simple Technique Skill

This demonstrates a minimal, well-formed skill — within the simple-technique word target, no supporting directories needed.

```
rotate-pdf/
└── SKILL.md
```

## SKILL.md Content

````markdown
---
name: rotate-pdf
description: >
  Use when the user asks to "rotate a PDF", "fix PDF orientation",
  "turn PDF pages", or has a PDF displaying sideways or upside down.
license: MIT
metadata:
  category: Documents
  summary: Rotates selected PDF pages to a new file and verifies the result.
---

# Rotate PDF

## Overview

Rotate PDF pages to correct orientation using Python's pypdf library. Handles single-page, multi-page, and selective page rotation.

## Scope

Use when:
- User has a PDF displaying in wrong orientation
- User asks to rotate specific pages or all pages
- PDF scanned sideways or upside down

Do not use when:
- Task involves editing PDF content (text, images) — use a PDF editor skill
- Task is merging or splitting PDFs — different operation
- File is not a PDF

## Required Context

- Readable source PDF and a distinct output path
- Rotation in clockwise degrees: 90, 180, or 270
- Target pages expressed as human-facing one-based numbers, or all pages

## Tool Guidance

Use Python 3 with `pypdf`. If the package is unavailable, request permission before installing it; never substitute an unverified PDF rewrite command. Preserve the source file, document metadata, page count, and every non-targeted page. Reject page numbers outside the document instead of silently ignoring them.

## Workflow

1. Confirm the target PDF path, output path, desired rotation (90, 180, or 270 degrees), and whether all or selected pages rotate. Done when all four values are explicit.
2. Save this complete example as `rotate.py`; pass the four confirmed values as arguments. `PAGES` is `all` or comma-separated one-based page numbers:

   ```python
   import sys
   from pypdf import PdfReader, PdfWriter

   source, output, degrees, pages = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
   # Convert the user's one-based page numbers at the input boundary only.
   selected = None if pages == "all" else {int(page) - 1 for page in pages.split(",")}
   reader, writer = PdfReader(source), PdfWriter()
   if selected and (min(selected) < 0 or max(selected) >= len(reader.pages)):
       raise ValueError("page number outside document")
   for index, page in enumerate(reader.pages):
       writer.add_page(page.rotate(degrees) if selected is None or index in selected else page)
   # Page copying does not automatically preserve document-level metadata.
   if reader.metadata:
       writer.add_metadata(reader.metadata)
   with open(output, "wb") as target:
       writer.write(target)
   ```

   Execute as `python3 rotate.py input.pdf output.pdf 90 all`. Done when the command exits zero and writes the new file without modifying the source.
3. Open or render the output and inspect every rotated page plus one untouched page when present. Done when orientation and preservation are observed.
4. Report the output path and verified pages. Done when the user can locate the new file.

## Success Criteria

- Output PDF exists and is valid
- Rotated pages display in correct orientation
- Non-targeted pages remain unchanged
- Original file preserved (output written to new path)

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Overwriting the original file | Always write to a new output path |
| Rotating wrong direction | Confirm: 90 = clockwise, 270 = counter-clockwise |
| Forgetting 0-indexed pages | pypdf uses 0-based indexing; user says "page 1", code uses index 0 |

## Failure Modes

- **Encrypted PDF:** Stop and inform user — decryption required first.
- **Corrupted PDF:** Report the error; do not attempt repair.
````

## Why This Works

- **About 500 words** — within the simple-technique target
- **No references/ needed** — everything fits in SKILL.md
- **Clear boundaries** — "Do Not Use When" prevents misapplication
- **Concrete success criteria** — agent knows when it's done
- **Failure modes** — agent knows when to stop
- **Description** — trigger-focused, includes user phrases, no workflow summary
