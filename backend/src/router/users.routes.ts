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
import { CreateUserSerializer } from "../serializers/users.serializers";

const userRouter = Router();

userRouter.post(
  "",
  validateSchemaMiddleware(CreateUserSerializer),
  createUserController
);

userRouter.get("/profile", ensureAuthMiddleware, listUserController);

userRouter.delete(
  "/:id",
  ensureAuthMiddleware,
  ensureIsOwner,
  ensureUserExists,
  deleteUserController
);

userRouter.patch(
  "/:id",
  ensureAuthMiddleware,
  ensureIsOwner,
  ensureUserExists,
  updateUserController
);

export default userRouter;
