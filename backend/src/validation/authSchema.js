import Joi from "joi";

const authSchema = Joi.object({
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
      "string.pattern.base": "User ID can contain only alphanumeric characters, dots (.), underscores (_), or hyphens (-).",
    }),
  password: Joi.string().min(8).required(),
});

export { authSchema };
