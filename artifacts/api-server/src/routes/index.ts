import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import apiProjectsRouter from "./apiProjects.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(apiProjectsRouter);

export default router;
