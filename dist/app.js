"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./app/controllers/book.controller");
const borrow_controller_1 = require("./app/controllers/borrow.controller");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use("/api/books", book_controller_1.bookRouter);
exports.app.use("/api/borrow", borrow_controller_1.borrowRouter);
exports.app.get("/", (req, res) => {
    res.send("Welcome to Library Management System");
});
exports.default = exports.app;
