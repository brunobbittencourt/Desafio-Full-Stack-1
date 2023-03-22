import { Router } from "express";
import { loginController } from "../controllers";
import { validateSchemaMiddleware } from "../middlewares";
import { LoginSerializer } from "../serializers/users.serializers";

const loginRouter = Router();

loginRouter.post(
  "",
  validateSchemaMiddleware(LoginSerializer),
  loginController
);
