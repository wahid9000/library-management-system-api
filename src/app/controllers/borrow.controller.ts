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
