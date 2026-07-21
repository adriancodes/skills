import { handleRequest } from "./http/router";

export function startServer() {
  return { handle: handleRequest };
}
