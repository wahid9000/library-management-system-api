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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRouter = void 0;
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("../models/borrow.model");
const zod_1 = require("zod");
exports.borrowRouter = express_1.default.Router();
const borrowBookValidator = zod_1.z.object({
    book: zod_1.z.string(),
    quantity: zod_1.z.number(),
    dueDate: zod_1.z.string(),
});
exports.borrowRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield borrowBookValidator.parseAsync(req.body);
        const isBookCopiesAvailable = yield borrow_model_1.Borrow.isBookCopiesAvailable(payload === null || payload === void 0 ? void 0 : payload.book, payload === null || payload === void 0 ? void 0 : payload.quantity);
        if (isBookCopiesAvailable === null || isBookCopiesAvailable === void 0 ? void 0 : isBookCopiesAvailable.success) {
            const createdData = yield borrow_model_1.Borrow.create(payload);
            res.status(201).json({
                success: true,
                message: "Book borrowed successfully",
                data: createdData,
            });
        }
        else {
            if (isBookCopiesAvailable.status == 201) {
                res.status(201).json({
                    success: false,
                    message: isBookCopiesAvailable === null || isBookCopiesAvailable === void 0 ? void 0 : isBookCopiesAvailable.message,
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: isBookCopiesAvailable === null || isBookCopiesAvailable === void 0 ? void 0 : isBookCopiesAvailable.message,
                });
            }
        }
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: {
                name: error.name,
                errors: error.errors || JSON.parse(error.message),
            },
        });
    }
}));
exports.borrowRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const borrowedData = yield borrow_model_1.Borrow.aggregate([
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
}));
