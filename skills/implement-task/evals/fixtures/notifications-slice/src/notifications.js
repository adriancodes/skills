const notifications = [];

export function seed(id, message) {
  notifications.push({ id, message, read_at: null });
}

export function unreadCount() {
  return notifications.filter((n) => n.read_at === null).length;
}

export function reset() {
  notifications.length = 0;
}
