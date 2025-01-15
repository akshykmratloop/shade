import Joi from "joi";

const loginSchema = Joi.object({
  userId: Joi.alternatives()
    .try(
      Joi.string().email().required(), // Allow valid email format
      Joi.string()
        .pattern(/^[a-zA-Z0-9._@-]+$/) // Allow alphanumeric, dot (.), underscore (_), and hyphen (-)
        .min(3)
        .max(30)
        .required()
    )
    .required()
    .messages({
      "string.pattern.base":
        "User ID can contain only alphanumeric characters, dots (.), underscores (_), or hyphens (-).",
    }),
  password: Joi.string().min(8).required(),
});

const generateOtpSchema = Joi.object({
  userId: Joi.string().email().min(3).max(30).required(),
  deviceId: Joi.string().min(6).max(20).required(),
});

const verifyOtp = Joi.object({
  otp: Joi.number().integer().min(100000).max(999999).required(),
});

export { loginSchema, generateOtpSchema, verifyOtp };
