import { Router } from "express";
import { UserSchema } from "./usersSchema";
import { validateBody } from "../../middleware";
import UsersController from "./usersController";

const router = Router();
router.get("/users", validateBody(UserSchema), UsersController.getUsers);

export default router;
