import "reflect-metadata";
import express from "express";
import "express-async-errors";
import { userRouter } from "./router";
import handleError from "./errors/handleError";

const app = express();
app.use(express.json());

app.use("/users", userRouter);

app.use(handleError);

export default app;
