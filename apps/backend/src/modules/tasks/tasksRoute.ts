import { Router } from "express";
import { TaskInput, TaskResponse, tasksListResponse } from "./tasksSchema";
import {
  authenticate,
  serializeResponse,
  validateBody,
} from "../../middleware";
import TasksController from "./tasksController";

const router = Router();

router.get(
  "/",
  authenticate,
  validateBody(TaskInput),
  serializeResponse(tasksListResponse),
  TasksController.getAll
);

router.get(
  "/:id",
  authenticate,
  validateBody(TaskInput),
  serializeResponse(TaskResponse),
  TasksController.getById
);

router.post(
  "/",
  authenticate,
  validateBody(TaskInput),
  serializeResponse(TaskResponse),
  TasksController.create
);

router.put(
  "/:id",
  authenticate,
  validateBody(TaskInput),
  serializeResponse(TaskResponse),
  TasksController.update
);

router.delete(
  "/:id",
  authenticate,
  validateBody(TaskInput),
  serializeResponse(TaskResponse),
  TasksController.delete
);

export default router;
