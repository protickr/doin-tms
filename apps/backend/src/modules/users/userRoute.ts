import { Router } from "express";
import {
  User,
  UserLoginInput,
  UserSignupInput,
  UserLoginResponse,
} from "./usersSchema";
import { serializeResponse, validateBody } from "../../middleware";
import UsersController from "./usersController";

const router = Router();

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
