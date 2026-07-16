import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorMiddleware } from "./middleware/error.middleware";

const app: Application = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Spenzee Backend",
  });
});

// global error handler 

app.use(errorMiddleware);

export default app;