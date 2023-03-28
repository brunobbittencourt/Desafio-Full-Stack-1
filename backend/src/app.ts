import "reflect-metadata";
import express from "express";
import "express-async-errors";
import { loginRouter, userRouter } from "./router";
import handleError from "./errors/handleError";
import contactsRouter from "./router/contacts.router";

const app = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/login", loginRouter);
app.use("/contacts", contactsRouter);

app.use(handleError);

export default app;
