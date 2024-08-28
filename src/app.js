import express from "express";
import helmet from "helmet";

import { verifyToken } from "./middleware/auth.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentsRoutes from "./routes/commentRoutes.js";
import repliesRoutes from "./routes/repliesRoutes.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use("/api/v1/", authRoutes);
app.use("/api/v1", verifyToken, postRoutes);
app.use("/api/v1", verifyToken, userRoutes);
app.use("/api/v1", verifyToken, commentsRoutes);
app.use("/api/v1", verifyToken, repliesRoutes);

app.use(globalErrorHandler);
export default app;
