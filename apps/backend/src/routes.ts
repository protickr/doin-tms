import { Router } from "express";
import usersRoutes from "../src/modules/users/userRoute";
import tasksRoute from "../src/modules/tasks/tasksRoute";

const router = Router();

// Mount each module on a path
router.use("/users", usersRoutes);
router.use("/tasks", tasksRoute);

export default router;
