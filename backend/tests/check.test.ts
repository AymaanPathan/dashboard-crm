import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import type { AddressInfo } from "node:net";
import mainRouter from "../routes/index";

test("GET /check returns 200 with JSON { status: 'checked' }", async () => {
  const app = express();
  app.use("/", mainRouter);
  const server = app.listen(0);
  try {
    const { port } = server.address() as AddressInfo;
    const res = await fetch(`http://127.0.0.1:${port}/check`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") ?? "", /^application\/json/);
    assert.deepEqual(await res.json(), { status: "checked" });
  } finally {
    server.close();
  }
});
