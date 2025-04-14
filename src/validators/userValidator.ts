import Joi from "joi";

const kenyanPhonePattern = /^(?:\+254|0|254)?(7[0-9]{8}|1[0-9]{8})$/;

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
export const updateUserAdminSchema = Joi.object({
  firstName: Joi.string().min(3).max(50),
  lastName: Joi.string().min(3).max(50),
  phoneNumber: Joi.string()
    .pattern(/^(?:\+254|0|254)?(7[0-9]{8}|1[0-9]{8})$/)
    .message(
      "Phone number must be a valid Kenyan number (07xxxxxxxx, 01xxxxxxxx, or +2547xxxxxxxx)"
    )
    ,
  email: Joi.string().email(),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .message(
      "Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character"
    )
    ,
  roleId: Joi.string().uuid(),
});
export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(3).max(50),
  lastName: Joi.string().min(3).max(50),
  phoneNumber: Joi.string()
    .pattern(/^(?:\+254|0|254)?(7[0-9]{8}|1[0-9]{8})$/)
    .message(
      "Phone number must be a valid Kenyan number (07xxxxxxxx, 01xxxxxxxx, or +2547xxxxxxxx)"
    )
    ,
  email: Joi.string().email(),
  roleId: Joi.string().uuid(),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .message(
      "Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character"
    )
});

export const createRoleSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(3).max(200).required(),
});

export const technicianQuestionnaireSchema = Joi.object({
  businessName: Joi.string().required(),
  phoneNumber: Joi.string()
  .pattern(/^(?:\+254|0|254)?(7[0-9]{8}|1[0-9]{8})$/)
  .message(
    "Phone number must be a valid Kenyan number (07xxxxxxxx, 01xxxxxxxx, or +2547xxxxxxxx)"
  ).required(),
  email: Joi.string().email().required(),
  location: Joi.string().required(),
  businessType: Joi.string().required(),
  experienceYears: Joi.number().allow(null),
  experienceAreas: Joi.array().items(Joi.string()).optional(),
  brandsWorkedWith: Joi.array().items(Joi.string()).optional(),
  integrationExperience: Joi.string().required(),
  familiarWithStandard: Joi.string().valid("Yes, I'm certified", "No").required(),
  purchaseSource: Joi.array().items(Joi.string()).required(),
  purchaseHikvision: Joi.string().valid("Yes", "No").required(),
  requiresTraining: Joi.string().valid("Yes", "No").allow(null),
});



export const shopOwnersQuestionnaireSchema = Joi.object({
  companyName: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.string()
    .pattern(kenyanPhonePattern)
    .message(
      'Phone number must be a valid Kenyan number (07xxxxxxxx, 01xxxxxxxx, or +2547xxxxxxxx)'
    )
    .required(),
  phoneNumber2: Joi.string()
    .pattern(kenyanPhonePattern)
    .message(
      'Phone number must be a valid Kenyan number (07xxxxxxxx, 01xxxxxxxx, or +2547xxxxxxxx)'
    )
    .optional()
    .allow('', null),
  email: Joi.string().email().required(),
  email2: Joi.string().email().optional().allow('', null),
  address: Joi.string().required(),
  selectedBusinessType: Joi.string().required(),
  selectedBrands: Joi.array().items(Joi.string()).required(),
  selectedSecurityBrands: Joi.array().items(Joi.string()).required(),
  otherBrand: Joi.string().optional().allow('', null),
  selectedCategories: Joi.array().items(Joi.string()).required(),
  hikvisionChallenges: Joi.string().optional().allow('', null),
  adviceToSecureDigital: Joi.string().optional().allow('', null),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .message(
      "Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character"
    )
    .required(),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "The confirmation password must match the new password",
    }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});
export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().min(4).max(6).required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .message(
      "Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character"
    )
    .required(),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "The confirmation password must match the new password",
    }),
});
