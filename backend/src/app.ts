import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";

import { errorHandler } from "./middlewares/errorHandler";
import adminRoutes from "./routes/admin/AdminRoutes";
import authRoutes from "./routes/auth/AuthRoutes";
import providerRoutes from "./routes/provider/ProviderRoutes";
import userRoutes from "./routes/user/UserRoutes";

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
