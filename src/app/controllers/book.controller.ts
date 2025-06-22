import express, { Request, Response } from "express";
import * as z from "zod/v4";
import { Book } from "../models/book.model";
import { IBook } from "../interfaces/book.interface";

export const bookRouter = express.Router();

const createBookValidator = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number().min(0, "Copies must be a positive number"),
  available: z.boolean(),
});

bookRouter.post("/", async (req, res) => {
  try {
    const payload = await createBookValidator.parseAsync(req.body);
    const createdData = await Book.create(payload);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: createdData,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: error.message,
    });
  }
});

bookRouter.get("/", async (req: Request, res: Response) => {
  const { filter, sort, sortBy, limit } = req.query;
  const query: any = {};
  const sortConfig: Record<string, "asc" | "desc"> = {};
  if (filter) {
    query.genre = filter;
  }
  if (sortBy && sort) {
    sortConfig[sortBy] = sort;
  }

  const findData = await Book.find(query)
    .sort(sortConfig)
    .limit(parseInt(limit) || 10);

  res.status(201).json({
    success: true,
    message: "Books retrived successfully",
    data: findData,
  });
});
