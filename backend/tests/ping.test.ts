import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import type { AddressInfo } from "node:net";
import mainRouter from "../routes/index";

test("GET /ping returns 200 with plain-text pong", async () => {
  const app = express();
  app.use("/", mainRouter);
  const server = app.listen(0);
  try {
    const { port } = server.address() as AddressInfo;
    const res = await fetch(`http://127.0.0.1:${port}/ping`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") ?? "", /^text\/plain/);
    assert.equal(await res.text(), "pong");
  } finally {
    server.close();
  }
});
