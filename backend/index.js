import express from "express";

import dotenv from "dotenv";
import pino from "pino";
import pinoHttp from "pino-http";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import AuthRoutes from "./auth/routes/auth.routes.js"
import ChatRoutes from "./chat/routes/chat.routes.js"
import cors from "cors";
 

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

const logger = pino({
    level: "info",
  
    // Pretty output only in development.
    transport: false
      ? undefined
      : {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
            singleLine: true,
          },
        },
  });
app.use(
    pinoHttp({
      logger,
      autoLogging: true,
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
      },
  
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },
  
      customSuccessMessage: (req, res) =>
        `${req.method} ${req.url} → ${res.statusCode}`,
  
      customErrorMessage: (req, res) =>
        `${req.method} ${req.url} → ${res.statusCode}`,
  
      customProps: () => ({
        service: "auth",
      }),
    })
  );

app.use("/auth", AuthRoutes);
app.use("/chat", ChatRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ message: "backend is running", status: "ok" });
});

const start = async () => {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`backend is running on port ${process.env.PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
