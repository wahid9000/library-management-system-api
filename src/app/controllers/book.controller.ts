import express, { Request, Response } from "express";
import * as z from "zod/v4";
import { Book } from "../models/book.model";

export const bookRouter = express.Router();

const createBookValidator = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number(),
  available: z.boolean(),
});

bookRouter.post("/", async (req, res) => {
  try {
    const payload = await createBookValidator.parseAsync(req.body);
    if (payload.copies === 0) {
      payload.available = false;
    }
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
      error: {
        name: error.name,
        errors: error.errors || JSON.parse(error.message),
      },
    });
  }
});

bookRouter.get("/", async (req: Request, res: Response) => {
  const { filter, sort, sortBy, limit } = req.query;
  const query: Record<string, string> = {};
  const sortConfig: Record<string, "asc" | "desc"> = {};
  const limitValue = typeof limit === "string" ? parseInt(limit) : 10;

  if (typeof filter === "string") {
    query.genre = filter;
  }

  if (typeof sortBy === "string" && typeof sort === "string") {
    sortConfig[sortBy] = sort as "asc" | "desc";
  }

  const findData = await Book.find(query).sort(sortConfig).limit(limitValue);

  res.status(201).json({
    success: true,
    message: "Books retrived successfully",
    data: findData,
  });
});

bookRouter.get("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const singleBookData = await Book.findById(bookId);
  res.status(201).json({
    success: true,
    message: "Book retrieved successfully",
    data: singleBookData,
  });
});

bookRouter.patch("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const body = req.body;
  const updatedBookData = await Book.findByIdAndUpdate(bookId, body, {
    new: true,
  });
  res.status(201).json({
    success: true,
    message: "Book updated successfully",
    data: updatedBookData,
  });
});

bookRouter.delete("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const deletedBookData = await Book.findByIdAndDelete(bookId, { new: true });
  res.status(201).json({
    success: true,
    message: "Book deleted successfully",
    data: deletedBookData,
  });
});
