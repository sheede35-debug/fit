import { Router, type IRouter } from "express";
import healthRouter from "./health";
import companiesRouter from "./companies";
import departmentsRouter from "./departments";
import usersRouter from "./users";
import workflowsRouter from "./workflows";
import requestsRouter from "./requests";
import commentsRouter from "./comments";
import notificationsRouter from "./notifications";
import analyticsRouter from "./analytics";
import aiRouter from "./ai";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(companiesRouter);
router.use(departmentsRouter);
router.use(usersRouter);
router.use(workflowsRouter);
router.use(requestsRouter);
router.use(commentsRouter);
router.use(notificationsRouter);
router.use(analyticsRouter);
router.use(aiRouter);
router.use(adminRouter);

export default router;
