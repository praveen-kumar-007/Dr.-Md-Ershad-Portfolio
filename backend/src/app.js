import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigin =
  process.env.FRONTEND_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : undefined);
const corsOptions = allowedOrigin
  ? { origin: allowedOrigin, credentials: true }
  : {};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "Dr. Md Ershad backend is running" });
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use(notFound);
app.use(errorHandler);

export default app;
