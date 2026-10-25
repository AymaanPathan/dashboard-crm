import express from "express";

const pingRouter = express.Router();

// Public liveness check: plain-text "pong", no auth, no database.
pingRouter.get("/", (_req, res) => {
  res.status(200).type("text/plain").send("pong");
});

export default pingRouter;
