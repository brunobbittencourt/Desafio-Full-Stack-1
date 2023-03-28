import { Router } from "express";
import createContactController from "../controllers/contacts/createContact.controller";
import deleteContactController from "../controllers/contacts/deleteContact.controller";
import listContactController from "../controllers/contacts/listContact.controller";
import updateContactController from "../controllers/contacts/updateContact.controller";
import { ensureAuthMiddleware, validateSchemaMiddleware } from "../middlewares";
import {
  CreateContactSerializer,
  UpdateContactSerializer,
} from "../serializers/contacts.serializers";

const contactsRouter = Router();

contactsRouter.post(
  "",
  ensureAuthMiddleware,
  validateSchemaMiddleware(CreateContactSerializer),
  createContactController
);

contactsRouter.get("", ensureAuthMiddleware, listContactController);

contactsRouter.patch(
  "/:id",
  ensureAuthMiddleware,
  validateSchemaMiddleware(UpdateContactSerializer),
  updateContactController
);

contactsRouter.delete("/:id", ensureAuthMiddleware, deleteContactController);

export default contactsRouter;
