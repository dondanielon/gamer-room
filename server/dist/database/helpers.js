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
exports.findUserWithRefreshToken = exports.findUserByEmail = exports.createUser = void 0;
const user_schema_1 = __importDefault(require("./user.schema"));
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newUser = new user_schema_1.default(Object.assign(Object.assign({}, user), { createdAt: new Date() }));
            yield newUser.save();
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createUser = createUser;
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_schema_1.default.findOne({ email: email });
            return user;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.findUserByEmail = findUserByEmail;
function findUserWithRefreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_schema_1.default.findOne({ refreshToken: refreshToken });
            return user;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.findUserWithRefreshToken = findUserWithRefreshToken;
