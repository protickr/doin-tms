import express from "express";
import config from "./config";
import routes from "./routes";
import { globalErrorHandler } from "../src/middleware";

const app = express();

app.use(routes);
app.use(express.json());
app.use(globalErrorHandler);

const PORT = config.port || 8080;
const runningEnv = config.nodeEnv || "development";

app.listen(PORT, () =>
  console.log(
    `Server running on http://localhost:${PORT} in ${runningEnv} mode`
  )
);
