import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { fetchLeads } from "./utils/fetchLeads.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.get("/api/leads", async (req, res) => {
  const { query } = req.query;
  let response = await fetchLeads(query);
  res.send(response);
});

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server starts at PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
