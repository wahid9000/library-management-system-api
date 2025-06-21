import express, { Application, Request, Response } from "express";

export const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  console.log("Welcome to Library Management System");
});

export default app;
