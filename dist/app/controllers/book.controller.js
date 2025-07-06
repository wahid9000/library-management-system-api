"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.bookRouter = void 0;
const express_1 = __importDefault(require("express"));
const z = __importStar(require("zod/v4"));
const book_model_1 = require("../models/book.model");
exports.bookRouter = express_1.default.Router();
const createBookValidator = z.object({
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    isbn: z.string(),
    description: z.string().optional(),
    copies: z.number(),
    available: z.boolean(),
});
exports.bookRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield createBookValidator.parseAsync(req.body);
        if (payload.copies === 0) {
            payload.available = false;
        }
        const createdData = yield book_model_1.Book.create(payload);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: createdData,
        });
    }
    catch (error) {
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
        }
        else {
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
}));
exports.bookRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filter, sort, sortBy, limit, page } = req.query;
    const query = {};
    const sortConfig = {};
    const limitValue = typeof limit === "string" ? parseInt(limit) : 10;
    const pageValue = typeof page === "string" ? parseInt(page) : 1;
    const skipValue = (pageValue - 1) * limitValue;
    if (typeof filter === "string") {
        query.genre = filter;
    }
    if (typeof sortBy === "string" && typeof sort === "string") {
        sortConfig[sortBy] = sort;
    }
    const total = yield book_model_1.Book.countDocuments(query);
    const findData = yield book_model_1.Book.find(query)
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
}));
exports.bookRouter.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const singleBookData = yield book_model_1.Book.findById(bookId);
    if (singleBookData) {
        res.status(201).json({
            success: true,
            message: "Book retrieved successfully",
            data: singleBookData,
        });
    }
    else {
        res.status(404).json({
            message: "Book ID not found",
            success: false,
            error: {},
        });
    }
}));
exports.bookRouter.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const body = req.body;
        const updatedBookData = yield book_model_1.Book.findByIdAndUpdate(bookId, body, {
            new: true,
        });
        console.log("🚀 ~ bookRouter.put ~ updatedBookData:", updatedBookData);
        if (updatedBookData) {
            res.status(201).json({
                success: true,
                message: "Book updated successfully",
                data: updatedBookData,
            });
        }
        else {
            res.status(404).json({
                message: "Book ID not found",
                success: false,
                error: {},
            });
        }
    }
    catch (error) {
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
        }
        else {
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
}));
exports.bookRouter.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const deletedBookData = yield book_model_1.Book.findByIdAndDelete(bookId, { new: true });
        if (deletedBookData) {
            res.status(201).json({
                success: true,
                message: "Book deleted successfully",
                data: deletedBookData,
            });
        }
        else {
            res.status(404).json({
                message: "Book ID not found",
                success: false,
                error: {},
            });
        }
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: {
                name: error.name,
                errors: error.errors,
            },
        });
    }
}));
