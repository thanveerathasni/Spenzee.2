import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user/UserRoutes";
import providerRoutes from "./routes/provider/ProviderRoutes";
import authRoutes from "./routes/auth/AuthRoutes";
import adminRoutes from "./routes/admin/AdminRoutes";

import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/providers", providerRoutes);

app.use("/api/admin", adminRoutes);

// global error handler
app.use(errorHandler);

export default app;