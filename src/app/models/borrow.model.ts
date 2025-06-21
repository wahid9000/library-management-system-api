import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";

const borrowSchema = new Schema<IBorrow>({
  book: { type: Schema.Types.ObjectId, required: true },
  quantity: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v > 0;
      },
      message: function (props) {
        return `Atleast 1 copy of book must be borrowed`;
      },
    },
  },
  dueDate: { type: Date, required: true },
});

export const Borrow = model<IBorrow>("Borrow", borrowSchema);
