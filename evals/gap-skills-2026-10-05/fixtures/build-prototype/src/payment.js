export function sendPayment(payment, queue) {
  return queue.enqueue(payment);
}
