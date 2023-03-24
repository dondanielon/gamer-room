"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const User = mongoose_1.default.model("user", new Schema({
    username: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    birthDate: { type: Date, required: true },
    createdAt: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true, default: false },
    refreshToken: { type: String, select: false }
}));
exports.default = User;
