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
const express_validator_1 = require("express-validator");
const user_schema_1 = __importDefault(require("../database/user.schema"));
function getValidations() {
    return {
        signupRequest: (0, express_validator_1.checkSchema)({
            username: {
                in: "body",
                notEmpty: { errorMessage: "username is required", bail: true },
                isString: { errorMessage: "invalid input type username", bail: true },
                custom: {
                    bail: true,
                    options: (username) => __awaiter(this, void 0, void 0, function* () {
                        const user = yield user_schema_1.default.findOne({ username: username });
                        if (user)
                            throw new Error("username already in use");
                        return true;
                    }),
                },
            },
            firstName: {
                in: "body",
                notEmpty: { errorMessage: "firstName is required", bail: true },
                isString: { errorMessage: "invalid input type firstName", bail: true },
            },
            lastName: {
                in: "body",
                notEmpty: { errorMessage: "lastName is required", bail: true },
                isString: { errorMessage: "invalid input type lastName", bail: true },
            },
            email: {
                in: "body",
                notEmpty: { errorMessage: "email is required", bail: true },
                isString: { errorMessage: "invalid input type email", bail: true },
                isEmail: { errorMessage: "invalid email", bail: true },
                custom: {
                    bail: true,
                    options: (email) => __awaiter(this, void 0, void 0, function* () {
                        const user = yield user_schema_1.default.findOne({ email: email });
                        if (user)
                            throw new Error("email already in use");
                        return true;
                    })
                }
            },
        }),
        signinRequest: (0, express_validator_1.checkSchema)({
            email: {
                in: "body",
                notEmpty: { errorMessage: "email is required", bail: true },
                isString: { errorMessage: "invalid input type email", bail: true },
                isEmail: { errorMessage: "invalid email", bail: true }
            },
            password: {
                in: "body",
                notEmpty: { errorMessage: "password is required", bail: true },
                isString: { errorMessage: "invalid input type password", bail: true }
            }
        })
    };
}
exports.default = getValidations;
