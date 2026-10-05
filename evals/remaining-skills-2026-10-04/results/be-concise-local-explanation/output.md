I’m applying the supplied be-concise skill and checking src/queue.js for the reason.


runQueue claims the job first so a worker skips sending when another worker owns it. If the claim succeeds, it sends the job, then marks it complete. If sending fails, this function leaves the claim unreleased; recovery must happen elsewhere.