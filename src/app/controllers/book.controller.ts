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
    if (error.code === 11000) {
      // It's a Mongo duplicate key error
      res.status(400).json({
        message: "ISBN number must be unique",
        success: false,
        error: {
          name: error.name,
          errors: error.errorResponse,
        },
      });
    } else {
      res.status(400).json({
        message: "Validation failed",
        success: false,
        error: {
          name: error.name,
          errors: error.errors || JSON.parse(error.message),
        },
      });
    }
  }
});

bookRouter.get("/", async (req: Request, res: Response) => {
  const { filter, sort, sortBy, limit, page } = req.query;
  const query: Record<string, string> = {};
  const sortConfig: Record<string, "asc" | "desc"> = {};
  const limitValue = typeof limit === "string" ? parseInt(limit) : 10;
  const pageValue = typeof page === "string" ? parseInt(page) : 1;
  const skipValue = (pageValue - 1) * limitValue;

  if (typeof filter === "string") {
    query.genre = filter;
  }

  if (typeof sortBy === "string" && typeof sort === "string") {
    sortConfig[sortBy] = sort as "asc" | "desc";
  }

  const total = await Book.countDocuments(query);

  const findData = await Book.find(query)
    .sort(sortConfig)
    .skip(skipValue)
    .limit(limitValue);

  res.status(201).json({
    success: true,
    message: "Books retrived successfully",
    data: findData,
    meta: {
      total,
      page: pageValue,
      limit: limitValue,
      totalPages: Math.ceil(total / limitValue),
    },
  });
});

bookRouter.get("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const singleBookData = await Book.findById(bookId);

  if (singleBookData) {
    res.status(201).json({
      success: true,
      message: "Book retrieved successfully",
      data: singleBookData,
    });
  } else {
    res.status(404).json({
      message: "Book ID not found",
      success: false,
      error: {},
    });
  }
});

bookRouter.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const body = req.body;
    const updatedBookData = await Book.findByIdAndUpdate(bookId, body, {
      new: true,
    });
    console.log("🚀 ~ bookRouter.put ~ updatedBookData:", updatedBookData);
    if (updatedBookData) {
      res.status(201).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBookData,
      });
    } else {
      res.status(404).json({
        message: "Book ID not found",
        success: false,
        error: {},
      });
    }
  } catch (error: any) {
    if (error.code === 11000) {
      // It's a Mongo duplicate key error
      res.status(400).json({
        message: "ISBN number must be unique",
        success: false,
        error: {
          name: error.name,
          errors: error.errorResponse,
        },
      });
    } else {
      res.status(400).json({
        message: "Validation failed",
        success: false,
        error: {
          name: error.name,
          errors: error.errors,
        },
      });
    }
  }
});

bookRouter.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const deletedBookData = await Book.findByIdAndDelete(bookId, { new: true });
    if (deletedBookData) {
      res.status(201).json({
        success: true,
        message: "Book deleted successfully",
        data: deletedBookData,
      });
    } else {
      res.status(404).json({
        message: "Book ID not found",
        success: false,
        error: {},
      });
    }
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: error.name,
        errors: error.errors,
      },
    });
  }
});
