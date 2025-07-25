import { model, Schema } from "mongoose";
import {
  BookAvailableModelType,
  IBorrow,
} from "../interfaces/borrow.interface";
import { Book } from "./book.model";

const borrowSchema = new Schema<IBorrow, BookAvailableModelType>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: function (props) {
          return `At least 1 copy of book must be borrowed`;
        },
      },
    },
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

borrowSchema.static(
  "isBookCopiesAvailable",
  async function (bookId, numberOfCopiesToBorrow) {
    const bookInfo = await Book.findOne({ _id: bookId });

    if (!bookInfo) {
      return {
        status: 404,
        success: false,
        message: `No book found with the ID ${bookId}`,
      };
    }

    if (bookInfo?.available) {
      const numberOfCopiesAvailable = bookInfo?.copies || 0;
      if (numberOfCopiesAvailable === numberOfCopiesToBorrow) {
        await Book.findByIdAndUpdate(
          bookId,
          { available: false },
          { new: true }
        );
        return { status: 201, success: true, message: "" };
      } else if (numberOfCopiesAvailable > numberOfCopiesToBorrow) {
        return { status: 201, success: true, message: "" };
      } else {
        return {
          status: 201,
          success: false,
          message: `We have ${numberOfCopiesAvailable} copies of book available for borrow at the moment`,
        };
      }
    } else {
      return {
        status: 201,
        success: false,
        message: `This book is not available for borrow. Please try another one`,
      };
    }
  }
);

borrowSchema.post("save", async function (doc, next) {
  const bookId = doc.book;
  const numberOfCopies = doc.quantity;
  await Book.findByIdAndUpdate(bookId, {
    $inc: { copies: -numberOfCopies },
  });
  next();
});

export const Borrow = model<IBorrow, BookAvailableModelType>(
  "Borrow",
  borrowSchema
);
