"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.authAdminMiddleware = exports.authMiddleware = exports.invalidPathHandler = exports.errorResponder = exports.errorLogger = exports.requestLogger = exports.AppError = void 0;
exports.setupCors = setupCors;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../config/index");
const index_2 = require("../services/index");
const cors_1 = __importDefault(require("cors"));
// Error object used in error handling middleware function
class AppError extends Error {
    statusCode;
    errors; // To hold multiple error messages
    constructor(statusCode, message) {
        if (Array.isArray(message)) {
            super(message.join(", ")); // Convert array to a comma-separated string for Error's message
            this.errors = message;
        }
        else {
            super(message);
            this.errors = [message]; // Wrap a single message into an array
        }
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = "AppError";
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
// Middleware function for logging the request method and request URL
const requestLogger = (request, response, next) => {
    console.log(`${request.method} url:: ${request.url}`);
    next();
};
exports.requestLogger = requestLogger;
// Error handling Middleware function for logging the error message
const errorLogger = (error, request, response, next) => {
    const timestamp = new Date().toISOString().toLocaleString();
    console.error(`[${timestamp}] Error: ${error.message}`);
    if (process.env.NODE_ENV === "development" && error.stack) {
        console.error(`[${timestamp}] Stack Trace: ${error.stack}`);
    }
    next(error); // Calling next middleware
};
exports.errorLogger = errorLogger;
// Error handling Middleware function reads the error message
// and sends back a response in JSON format
const errorResponder = (error, request, response, next) => {
    response.header("Content-Type", "application/json");
    const status = error.statusCode || 400;
    const message = error.message || "Something went wrong";
    const errors = error.errors || [message];
    response.status(status).json({
        error: {
            status,
            message,
            errors,
        },
    });
};
exports.errorResponder = errorResponder;
// Fallback Middleware function for returning
// 404 error for undefined paths
const invalidPathHandler = (request, response, next) => {
    response.status(404);
    response.send({
        error: {
            status: 404,
            message: "Invalid path",
        },
    });
};
exports.invalidPathHandler = invalidPathHandler;
// Middleware to protect routes using JWT
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return next(new AppError(401, "Please authenticate"));
        }
        if (!authHeader.startsWith("Bearer ")) {
            return next(new AppError(401, "Invalid authorization format"));
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return next(new AppError(401, "Token is required"));
        }
        jsonwebtoken_1.default.verify(token.trim(), index_1.JWT_SECRET, (err, decodeToken) => {
            if (err) {
                return next(new AppError(401, err.message));
            }
            if (!decodeToken) {
                return next(new AppError(401, "Problem decoding token"));
            }
            req.user = decodeToken;
            next();
        });
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
const authAdminMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return next(new AppError(401, "Please authenticate"));
        }
        if (!authHeader.startsWith("Bearer ")) {
            return next(new AppError(401, "Invalid authorization format"));
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return next(new AppError(401, "Token is required"));
        }
        jsonwebtoken_1.default.verify(token.trim(), index_1.JWT_SECRET, async (err, decodeToken) => {
            if (err) {
                return next(new AppError(401, err.message));
            }
            if (!decodeToken) {
                return next(new AppError(401, "Problem decoding token"));
            }
            // Check if user is Admin
            const isAdmin = await index_2.userService.isUserAdmin(decodeToken.email);
            if (!isAdmin) {
                return next(new AppError(401, "You should not be here"));
            }
            req.user = decodeToken;
            next();
        });
    }
    catch (error) {
        next(error);
    }
};
exports.authAdminMiddleware = authAdminMiddleware;
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errMessages = error.details.map((err) => err.message);
            throw new AppError(400, errMessages);
        }
        next();
    };
};
exports.validate = validate;
function setupCors() {
    const originsWithCredentials = [
        "https://admin.hikvisionkenyashop.com",
        "http://localhost:3000",
    ];
    const originsWithoutCredentials = ["https://hikvisionkenyashop.com"];
    const corsOptionsDelegate = (req, callback) => {
        const requestOrigin = req.header("Origin");
        if (!requestOrigin) {
            return callback(null, { origin: false });
        }
        let corsOptions;
        if (originsWithCredentials.includes(requestOrigin)) {
            corsOptions = {
                origin: requestOrigin,
                credentials: true,
            };
        }
        else if (originsWithoutCredentials.includes(requestOrigin)) {
            corsOptions = {
                origin: requestOrigin,
                credentials: false,
            };
        }
        else {
            // Not allowed
            corsOptions = { origin: false };
        }
        callback(null, corsOptions);
    };
    return (0, cors_1.default)(corsOptionsDelegate);
}
