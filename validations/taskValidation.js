const Joi = require('joi');

const createTaskSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().allow(null, '').optional(),
    position: Joi.number().integer().min(0).optional().default(0),
    status: Joi.string().valid('backlog', 'progress', 'test', 'done').default('backlog')
});

const updateTaskSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(null, ''),
    position: Joi.number().integer().min(0),
    status: Joi.string().valid('backlog', 'progress', 'test', 'done'),
}).min(1);

const validate = (schema, data) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        return { error: error.details.map(d => d.message) };
    }
    return { value };
};

module.exports = { createTaskSchema, updateTaskSchema, validate };
