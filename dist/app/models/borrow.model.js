"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrow = void 0;
const mongoose_1 = require("mongoose");
const book_model_1 = require("./book.model");
const borrowSchema = new mongoose_1.Schema({
    book: { type: mongoose_1.Schema.Types.ObjectId, ref: "Book", required: true },
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
}, {
    timestamps: true,
});
borrowSchema.static("isBookCopiesAvailable", function (bookId, numberOfCopiesToBorrow) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookInfo = yield book_model_1.Book.findOne({ _id: bookId });
        if (bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.available) {
            const numberOfCopiesAvailable = (bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.copies) || 0;
            if (numberOfCopiesAvailable === numberOfCopiesToBorrow) {
                yield book_model_1.Book.findByIdAndUpdate(bookId, { available: false }, { new: true });
                return { success: true, message: "Successfully borrowed" };
            }
            else if (numberOfCopiesAvailable > numberOfCopiesToBorrow) {
                return { success: true, message: "Successfully borrowed" };
            }
            else {
                return {
                    success: false,
                    message: `We have ${numberOfCopiesAvailable} copies of book available for borrow at the moment`,
                };
            }
        }
        else {
            return {
                success: false,
                message: `This book is not available`,
            };
        }
    });
});
borrowSchema.post("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookId = doc.book;
        const numberOfCopies = doc.quantity;
        yield book_model_1.Book.findByIdAndUpdate(bookId, {
            $inc: { copies: -numberOfCopies },
        });
        next();
    });
});
exports.Borrow = (0, mongoose_1.model)("Borrow", borrowSchema);
