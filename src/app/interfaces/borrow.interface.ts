import { Model, Types } from "mongoose";

export interface IBorrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

export interface BookAvailableModelType extends Model<IBorrow> {
  isBookCopiesAvailable(
    bookId: string,
    numberOfCopiesToBorrow: number
  ): {
    status: number;
    success: boolean;
    message: string;
  };
}
