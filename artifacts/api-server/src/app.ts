import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { sessionMiddleware } from "./middlewares/sessionSetup.js";
import router from "./routes/index.js";
import adminRouter from "./routes/admin.js";
import portfolioRouter from "./routes/portfolio.js";
import { logger } from "./lib/logger.js";
import { seedIfEmpty } from "./lib/seed.js";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

seedIfEmpty().catch(err => logger.error({ err }, "Seed failed"));

app.use("/api", router);
app.use("/admin", adminRouter);
app.use("/", portfolioRouter);

export default app;
