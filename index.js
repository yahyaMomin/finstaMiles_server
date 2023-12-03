import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import connectDB from "./db/connect_DB.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import { verifyToken } from "./middleware/auth.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentsRoutes from "./routes/commentRoutes.js";
import repliesRoutes from "./routes/repliesRoutes.js";

const app = express();

app.use(cors());

dotenv.config();
app.use(express.json());

app.use(helmet());
app.use(morgan("common"));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/auth", verifyToken, postRoutes);
app.use("/auth", verifyToken, userRoutes);
app.use("/auth", verifyToken, commentsRoutes);
app.use("/auth", verifyToken, repliesRoutes);

app.get("/", (req, res) => {
  res.send("server is started");
});

connectDB();

const PORT = process.env.PORT;

app.listen(PORT);
