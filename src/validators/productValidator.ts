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
