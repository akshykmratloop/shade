import Joi from "joi";

const nameRule = Joi.string().min(3).max(30).required();
const descriptionRule = Joi.string()

const createRoleSchema = Joi.object({
    name: nameRule,
    description: descriptionRule,
});



export {
    createRoleSchema
};
