import { Router } from "express";
import {
  User,
  UserLoginInput,
  UserSignupInput,
  UserLoginResponse,
  UsersListResponse,
} from "./usersSchema";
import {
  authenticate,
  serializeResponse,
  validateBody,
} from "../../middleware";
import UsersController from "./usersController";

const router = Router();

router.get(
  "/", // list users (id + name)
  authenticate,
  serializeResponse(UsersListResponse),
  UsersController.getUsers
);

router.post(
  "/", // route path
  validateBody(UserSignupInput),
  serializeResponse(User),
  UsersController.signUp
);

router.post(
  "/login",
  validateBody(UserLoginInput),
  serializeResponse(UserLoginResponse),
  UsersController.login
);

export default router;
