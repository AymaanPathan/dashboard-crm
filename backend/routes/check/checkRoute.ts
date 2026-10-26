import express from "express";

const checkRouter = express.Router();

// Public check: simple JSON { status: "checked" }, no auth, no database.
checkRouter.get("/", (_req, res) => {
  res.status(200).json({ status: "checked" });
});

export default checkRouter;
