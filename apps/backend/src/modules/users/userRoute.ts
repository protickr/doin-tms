import { Router } from "express";
import UsersController from "./usersController";
const router = Router();

router.get("/users", UsersController.getUsers);

export default router;
