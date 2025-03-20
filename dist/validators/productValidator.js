"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = exports.checkoutSchema = exports.addWhishlisttSchema = exports.updateCartSchema = exports.addCartSchema = exports.productSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Feature schema
const featureSchema = joi_1.default.object({
    description: joi_1.default.string().min(3).required(),
});
// Model schema
const modelSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    description: joi_1.default.string().min(3).required(),
    price: joi_1.default.number().greater(0).required(),
    features: joi_1.default.array().items(featureSchema).required(),
    inventory: joi_1.default.object({
        quantity: joi_1.default.number().integer().min(0),
    }).required(),
});
// Main product schema
exports.productSchema = joi_1.default.object({
    productData: joi_1.default.object({
        name: joi_1.default.string().min(3).required(),
        subCategoryId: joi_1.default.string().uuid().required(),
        // defaultPrice: Joi.number().greater(0).required(),
        models: joi_1.default.array().items(modelSchema).min(1).required(),
    }).required(),
});
exports.addCartSchema = joi_1.default.object({
    userId: joi_1.default.string().uuid().required(),
    productModelId: joi_1.default.string().uuid().required(),
    quantity: joi_1.default.number().greater(0).required(),
});
exports.updateCartSchema = joi_1.default.object({
    userId: joi_1.default.string().uuid().required(),
    productModelId: joi_1.default.string().uuid().required(),
    quantity: joi_1.default.number().greater(0).required(),
});
exports.addWhishlisttSchema = joi_1.default.object({
    productModelId: joi_1.default.string().uuid().required(),
});
exports.checkoutSchema = joi_1.default.object({
    orderId: joi_1.default.string().uuid().required(),
    amount: joi_1.default.number().greater(0).required(),
    phoneNumber: joi_1.default.string()
        .pattern(/^(?:\+254|0|254)?(7[0-9]{8}|1[0-9]{8})$/)
        .message("Phone number must be a valid Kenyan number (07xxxxxxxx, 01xxxxxxxx, or +2547xxxxxxxx)")
        .required(),
});
exports.createOrderSchema = joi_1.default.object({
    first_name: joi_1.default.string().required().messages({
        "any.required": '"first_name" is required',
    }),
    last_name: joi_1.default.string().required().messages({
        "any.required": '"last_name" is required',
    }),
    company_name: joi_1.default.string().optional(),
    street_address: joi_1.default.string().required().messages({
        "any.required": '"street_address" is required',
    }),
    apartment: joi_1.default.string().optional(),
    isVat: joi_1.default.boolean().required(),
    town: joi_1.default.string().required().messages({
        "any.required": '"town" is required',
    }),
    phone_number: joi_1.default.string()
        .pattern(/^(?:\+254|0|254)?(7[0-9]{8}|1[0-9]{8})$/)
        .message("Phone number must be a valid Kenyan number (07xxxxxxxx, 01xxxxxxxx, or +2547xxxxxxxx)")
        .required(),
    email: joi_1.default.string().email().required().messages({
        "string.email": '"email" must be a valid email',
        "any.required": '"email" is required',
    }),
    products: joi_1.default.array()
        .items(joi_1.default.object({
        productModelId: joi_1.default.string()
            .guid({ version: "uuidv4" })
            .required()
            .messages({
            "string.guid": '"productModelId" must be a valid UUID',
            "any.required": '"productModelId" is required',
        }),
        quantity: joi_1.default.number().integer().positive().required().messages({
            "number.integer": '"quantity" must be an integer',
            "number.positive": '"quantity" must be a positive number',
            "any.required": '"quantity" is required',
        }),
    }))
        .min(1)
        .required()
        .messages({
        "array.min": '"products" must contain at least one product',
        "any.required": '"products" is required',
    }),
});
