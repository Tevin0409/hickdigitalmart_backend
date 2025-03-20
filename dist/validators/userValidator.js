"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.technicianQuestionnaireSchema = exports.createRoleSchema = exports.updateUserSchema = exports.updateUserAdminSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(3).max(50).required(),
    lastName: joi_1.default.string().min(3).max(50).required(),
    phoneNumber: joi_1.default.string()
        .pattern(/^(?:\+254|0|254)?(7[0-9]{8}|1[0-9]{8})$/)
        .message("Phone number must be a valid Kenyan number (07xxxxxxxx, 01xxxxxxxx, or +2547xxxxxxxx)")
        .required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .message("Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character")
        .required(),
    roleId: joi_1.default.string().uuid().required(),
});
exports.updateUserAdminSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(3).max(50),
    lastName: joi_1.default.string().min(3).max(50),
    phoneNumber: joi_1.default.string()
        .pattern(/^(?:\+254|0|254)?(7[0-9]{8}|1[0-9]{8})$/)
        .message("Phone number must be a valid Kenyan number (07xxxxxxxx, 01xxxxxxxx, or +2547xxxxxxxx)"),
    email: joi_1.default.string().email(),
    password: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .message("Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character"),
    roleId: joi_1.default.string().uuid(),
});
exports.updateUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(3).max(50),
    lastName: joi_1.default.string().min(3).max(50),
    phoneNumber: joi_1.default.string()
        .pattern(/^(?:\+254|0|254)?(7[0-9]{8}|1[0-9]{8})$/)
        .message("Phone number must be a valid Kenyan number (07xxxxxxxx, 01xxxxxxxx, or +2547xxxxxxxx)"),
    email: joi_1.default.string().email(),
    roleId: joi_1.default.string().uuid(),
    password: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .message("Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character")
});
exports.createRoleSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(50).required(),
    description: joi_1.default.string().min(3).max(200).required(),
});
exports.technicianQuestionnaireSchema = joi_1.default.object({
    businessName: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    location: joi_1.default.string().required(),
    businessType: joi_1.default.string().required(),
    experienceYears: joi_1.default.number().allow(null),
    experienceAreas: joi_1.default.array().items(joi_1.default.string()).optional(),
    brandsWorkedWith: joi_1.default.array().items(joi_1.default.string()).optional(),
    integrationExperience: joi_1.default.string().required(),
    familiarWithStandard: joi_1.default.string().valid("Yes, I'm certified", "No").required(),
    purchaseSource: joi_1.default.array().items(joi_1.default.string()).required(),
    purchaseHikvision: joi_1.default.string().valid("Yes", "No").required(),
    requiresTraining: joi_1.default.string().valid("Yes", "No").allow(null),
});
exports.changePasswordSchema = joi_1.default.object({
    oldPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .message("Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character")
        .required(),
    confirmNewPassword: joi_1.default.string()
        .valid(joi_1.default.ref("newPassword"))
        .required()
        .messages({
        "any.only": "The confirmation password must match the new password",
    }),
});
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
exports.resetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().min(4).max(6).required(),
    newPassword: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .message("Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character")
        .required(),
    confirmNewPassword: joi_1.default.string()
        .valid(joi_1.default.ref("newPassword"))
        .required()
        .messages({
        "any.only": "The confirmation password must match the new password",
    }),
});
