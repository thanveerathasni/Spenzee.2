import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

/**
 * Middlewares
 */
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

/**
 * Health Check Route
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Spenzee Backend 🚀"
  });
});

export default app;