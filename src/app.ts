import express, { Application, Request, Response } from "express";
import { bookRouter } from "./app/controllers/book.controller";

export const app: Application = express();

app.use(express.json());

app.use("/api/books", bookRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management System");
});

export default app;
