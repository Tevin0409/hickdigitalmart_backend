"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const verifyToken = (token, type) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, type === "refresh" ? config_1.JWT_REFRESH_SECRET : config_1.JWT_SECRET);
        if (typeof decoded === "string") {
            return null;
        }
        return decoded;
    }
    catch {
        return null;
    }
};
exports.verifyToken = verifyToken;
const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
    };
    const accessTokenExpiresIn = "1h";
    const refreshTokenExpiresIn = "7d";
    const accessToken = jsonwebtoken_1.default.sign(payload, config_1.JWT_SECRET, {
        expiresIn: accessTokenExpiresIn,
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.JWT_REFRESH_SECRET, {
        expiresIn: refreshTokenExpiresIn,
    });
    return {
        accessToken,
        refreshToken,
        accessTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    };
};
exports.generateToken = generateToken;
