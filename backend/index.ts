import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mainRouter from "./routes/index";
import { createServer } from "http";
import { initSocket } from "./utils/socket";
import './workers/setLeadTaskReminder'

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.send("TEST DONE Status OKAY!");
});
app.use("/", mainRouter);

const PORT = process.env.PORT || 5000;

// create HTTP server from Express
const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);

  initSocket(httpServer);
});
