# Atlas Upload SDK 1.4

Synthetic vendor primary-source fixture, revision 2026-09-01.

`upload(file)` transmits a complete file. If the request fails, `retry(file)` retransmits the complete file. Version 1.4 exposes no upload token or byte-offset continuation. A retry may succeed without user intervention, but it restarts at byte zero.
