import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/api/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "VOXA API is running",
    data: null,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", userRoutes);

export default app;