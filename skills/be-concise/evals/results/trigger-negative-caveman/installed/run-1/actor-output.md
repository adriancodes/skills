I’m using the tldr skill because “caveman mode” calls for a short, plain-English explanation.

Mutex = one key for shared cave.

One thread take key. Other threads wait. Thread change shared thing, then return key. Prevent threads smash same data at same time.

Forget return key? Everyone wait forever.
