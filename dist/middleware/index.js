import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { userService } from "../services";
// Error object used in error handling middleware function
export class AppError extends Error {
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
// Middleware function for logging the request method and request URL
export const requestLogger = (request, response, next) => {
    console.log(`${request.method} url:: ${request.url}`);
    next();
};
// Error handling Middleware function for logging the error message
export const errorLogger = (error, request, response, next) => {
    const timestamp = new Date().toISOString().toLocaleString();
    console.error(`[${timestamp}] Error: ${error.message}`);
    if (process.env.NODE_ENV === "development" && error.stack) {
        console.error(`[${timestamp}] Stack Trace: ${error.stack}`);
    }
    next(error); // Calling next middleware
};
// Error handling Middleware function reads the error message
// and sends back a response in JSON format
export const errorResponder = (error, request, response, next) => {
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
// Fallback Middleware function for returning
// 404 error for undefined paths
export const invalidPathHandler = (request, response, next) => {
    response.status(404);
    response.send({
        error: {
            status: 404,
            message: "Invalid path",
        },
    });
};
// Middleware to protect routes using JWT
export const authMiddleware = (req, res, next) => {
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
        jwt.verify(token.trim(), JWT_SECRET, (err, decodeToken) => {
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
export const authAdminMiddleware = async (req, res, next) => {
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
        jwt.verify(token.trim(), JWT_SECRET, async (err, decodeToken) => {
            if (err) {
                return next(new AppError(401, err.message));
            }
            if (!decodeToken) {
                return next(new AppError(401, "Problem decoding token"));
            }
            // Check if user is Admin
            const isAdmin = await userService.isUserAdmin(decodeToken.email);
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
export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errMessages = error.details.map((err) => err.message);
            throw new AppError(400, errMessages);
        }
        next();
    };
};
