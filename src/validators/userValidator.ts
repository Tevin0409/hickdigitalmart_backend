import Joi from "joi";

export const createUserSchema = Joi.object({
  firstName: Joi.string().min(3).max(50).required(),
  lastName: Joi.string().min(3).max(50).required(),
  phoneNumber: Joi.string()
    .pattern(/^(?:\+254|0|254)?(7[0-9]{8}|1[0-9]{8})$/)
    .message(
      "Phone number must be a valid Kenyan number (07xxxxxxxx, 01xxxxxxxx, or +2547xxxxxxxx)"
    )
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .message(
      "Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character"
    )
    .required(),
  roleId: Joi.string().uuid().required(),
});

export const createRoleSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(3).max(200).required(),
});

export const technicianQuestionnaireSchema = Joi.object({
  businessName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  location: Joi.string().required(),
  businessType: Joi.string().required(),
  experienceYears: Joi.number().allow(null),
  experienceAreas: Joi.array().items(Joi.string()).optional(),
  brandsWorkedWith: Joi.array().items(Joi.string()).optional(),
  integrationExperience: Joi.string().required(),
  purchaseSource: Joi.string().required(),
  purchaseHikvision: Joi.string().valid('Yes', 'No').required(),
  requiresTraining: Joi.string().valid('Yes', 'No').required(),
});
