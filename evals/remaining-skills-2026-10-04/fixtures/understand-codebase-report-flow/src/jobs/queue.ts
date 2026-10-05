type Job = { name: string; payload: Record<string, unknown> };

const pending: Job[] = [];

export async function enqueue(name: string, payload: Record<string, unknown>) {
  pending.push({ name, payload });
}

export function takeNextJob() {
  return pending.shift();
}
