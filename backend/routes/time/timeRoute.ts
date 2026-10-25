import express from "express";

const timeRouter = express.Router();

// Public: current server time as an ISO 8601 string, no auth, no database.
timeRouter.get("/", (_req, res) => {
  res.status(200).json({ time: new Date().toISOString() });
});

export default timeRouter;
