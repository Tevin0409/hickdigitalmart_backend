import Joi from "joi";
// Feature schema
const featureSchema = Joi.object({
    description: Joi.string().min(3).required(),
});
// Model schema
const modelSchema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    price: Joi.number().greater(0).required(),
    features: Joi.array().items(featureSchema).required(),
    inventory: Joi.object({
        quantity: Joi.number().integer().min(0),
    }).required(),
});
// Main product schema
export const productSchema = Joi.object({
    productData: Joi.object({
        name: Joi.string().min(3).required(),
        subCategoryId: Joi.string().uuid().required(),
        // defaultPrice: Joi.number().greater(0).required(),
        models: Joi.array().items(modelSchema).min(1).required(),
    }).required(),
});
export const addCartSchema = Joi.object({
    userId: Joi.string().uuid().required(),
    productModelId: Joi.string().uuid().required(),
    quantity: Joi.number().greater(0).required(),
});
export const updateCartSchema = Joi.object({
    userId: Joi.string().uuid().required(),
    productModelId: Joi.string().uuid().required(),
    quantity: Joi.number().greater(0).required(),
});
export const addWhishlisttSchema = Joi.object({
    productModelId: Joi.string().uuid().required(),
});
export const checkoutSchema = Joi.object({
    orderId: Joi.string().uuid().required(),
    amount: Joi.number().greater(0).required(),
    phoneNumber: Joi.string()
        .pattern(/^(?:\+254|0|254)?(7[0-9]{8}|1[0-9]{8})$/)
        .message("Phone number must be a valid Kenyan number (07xxxxxxxx, 01xxxxxxxx, or +2547xxxxxxxx)")
        .required(),
});
export const createOrderSchema = Joi.object({
    products: Joi.array().items(Joi.object({
        productModelId: Joi.string().guid({ version: 'uuidv4' }).required().messages({
            'string.guid': '"productModelId" must be a valid UUID',
            'any.required': '"productModelId" is required',
        }),
        quantity: Joi.number().integer().positive().required().messages({
            'number.integer': '"quantity" must be an integer',
            'number.positive': '"quantity" must be a positive number',
            'any.required': '"quantity" is required',
        }),
    })).min(1).required().messages({
        'array.min': '"products" must contain at least one product',
        'any.required': '"products" is required',
    }),
});
