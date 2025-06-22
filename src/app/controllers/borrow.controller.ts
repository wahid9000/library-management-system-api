import express, { Request, Response } from "express";
import { Borrow } from "../models/borrow.model";
import { z } from "zod";

export const borrowRouter = express.Router();

const borrowBookValidator = z.object({
  book: z.string(),
  quantity: z.number(),
  dueDate: z.string(),
});

borrowRouter.post("/", async (req: Request, res: Response) => {
  const payload = await borrowBookValidator.parseAsync(req.body);
  const isBookCopiesAvailable = await Borrow.isBookCopiesAvailable(
    payload?.book,
    payload?.quantity
  );
  if (isBookCopiesAvailable?.success) {
    const createdData = await Borrow.create(payload);
    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: createdData,
    });
  } else {
    res.status(201).json({
      success: false,
      message: isBookCopiesAvailable?.message,
    });
  }
});

borrowRouter.get("/", async (req: Request, res: Response) => {
  const borrowedData = await Borrow.aggregate([
    {
      $group: {
        _id: "$book",
        totalQuantity: { $sum: "$quantity" },
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "book",
      },
    },
    {
      $unwind: "$book",
    },
    {
      $project: {
        _id: 0,
        book: {
          title: "$book.title",
          isbn: "$book.isbn",
        },
        totalQuantity: "$totalQuantity",
      },
    },
  ]);
  res.status(201).json({
    success: true,
    message: "Borrowed books summary retrieved successfully",
    data: borrowedData,
  });
});
