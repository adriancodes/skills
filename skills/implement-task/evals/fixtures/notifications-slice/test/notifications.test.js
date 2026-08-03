import test from "node:test";
import assert from "node:assert/strict";
import { seed, unreadCount, reset } from "../src/notifications.js";

test("a seeded notification counts as unread", () => {
  reset();
  seed("n1", "welcome");
  assert.equal(unreadCount(), 1);
});
