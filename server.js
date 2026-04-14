import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import apiRoutes from "./routes/apiRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

const envClientUrls = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...envClientUrls,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (curl/postman) that send no origin.
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for this origin"));
    },
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "To-Do API is live",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "todo-backend",
  });
});

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
