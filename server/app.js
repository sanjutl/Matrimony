import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import adminRouter from "./routes/adminRouter.js";
import { io } from './index.js';

dotenv.config();

const app = express();
dotenv.config({
  path: "./env",
});

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

  
export { app, __dirname };
