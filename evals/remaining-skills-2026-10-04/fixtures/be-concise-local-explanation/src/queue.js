// claim returns false when another worker owns this job.
export async function runQueue(job, store, send) {
  if (!(await store.claim(job.id))) return false;
  await send(job);
  await store.complete(job.id);
  return true;
}
