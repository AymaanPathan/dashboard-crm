import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import type { AddressInfo } from "node:net";
import mainRouter from "../routes/index";

test("GET /time returns 200 with the server time as ISO 8601", async () => {
  const app = express();
  app.use("/", mainRouter);
  const server = app.listen(0);
  try {
    const { port } = server.address() as AddressInfo;
    const before = Date.now();
    const res = await fetch(`http://127.0.0.1:${port}/time`);
    const after = Date.now();
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") ?? "", /^application\/json/);
    const body = (await res.json()) as { time: string };
    assert.equal(typeof body.time, "string");
    const parsed = new Date(body.time);
    assert.ok(!Number.isNaN(parsed.getTime()), "time must parse as a valid date");
    assert.equal(parsed.toISOString(), body.time, "time must be an ISO 8601 string");
    assert.ok(parsed.getTime() >= before - 1000 && parsed.getTime() <= after + 1000);
  } finally {
    server.close();
  }
});
