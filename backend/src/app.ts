import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user/UserRoutes";
import { errorHandler } from "./middlewares/errorHandler";
const app: Application = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/users", userRoutes);

// global error handler

app.use(errorHandler);

export default app;
