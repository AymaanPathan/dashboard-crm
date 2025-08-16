import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.get("/test", (req, res) => {
  res.send("TEST DONE Status OKAY!");
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
