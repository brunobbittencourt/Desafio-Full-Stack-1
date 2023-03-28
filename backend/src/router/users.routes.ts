import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  listUserController,
  updateUserController,
} from "../controllers";
import {
  ensureAuthMiddleware,
  ensureUserExists,
  validateSchemaMiddleware,
} from "../middlewares";
import ensureIsOwner from "../middlewares/users/ensureIsOwnerOrAdmin.middleware";
import {
  CreateUserSerializer,
  UpdateUserSerializer,
} from "../serializers/users.serializers";

const userRouter = Router();

userRouter.post(
  "",
  validateSchemaMiddleware(CreateUserSerializer),
  createUserController
);

userRouter.get("/profile", ensureAuthMiddleware, listUserController);

userRouter.delete("", ensureAuthMiddleware, deleteUserController);

userRouter.patch(
  "",
  ensureAuthMiddleware,
  validateSchemaMiddleware(UpdateUserSerializer),
  updateUserController
);

export default userRouter;
