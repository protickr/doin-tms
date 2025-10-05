import express from "express";
import cors from "cors";
import config from "./config";
import routes from "./routes";
import { globalErrorHandler } from "../src/middleware";

const app = express();
app.use(express.json());

// Configure CORS using comma-separated CORS_ORIGIN env var
const raw = process.env.CORS_ORIGIN || "*";
const allowed = raw
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // allow requests with no origin (e.g. server-to-server, mobile clients)
    if (!origin) {
      console.debug("CORS: no origin - allowing");
      return callback(null, true);
    }

    const hostOnly = origin.replace(/:\d+$/, "");
    const allowedHit =
      allowed.includes("*") ||
      allowed.includes(origin) ||
      allowed.includes(hostOnly);
    console.debug(`CORS: origin=${origin} allowed=${allowedHit}`);
    if (allowedHit) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(routes);
app.use(globalErrorHandler);

const PORT = config.port || 8080;
const runningEnv = config.nodeEnv || "development";

app.listen(PORT, () =>
  console.log(
    `Server running on http://localhost:${PORT} in ${runningEnv} mode`
  )
);
