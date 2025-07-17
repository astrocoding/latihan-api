const Joi = require('joi');

const NotePayloadSchema = Joi.object({
  title: Joi.string().required().max(255).messages({
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title cannot exceed 255 characters',
    'any.required': 'Title is required'
  }),
  body: Joi.string().required().messages({
    'string.empty': 'Body cannot be empty',
    'any.required': 'Body is required'
  })
});

const NoteUpdatePayloadSchema = Joi.object({
  title: Joi.string().optional().max(255).messages({
    'string.max': 'Title cannot exceed 255 characters'
  }),
  body: Joi.string().optional().messages({
    'string.empty': 'Body cannot be empty'
  })
});

const NoteQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100'
  })
});

const NoteParamsSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Note ID cannot be empty',
    'any.required': 'Note ID is required'
  })
});

module.exports = {
  NotePayloadSchema,
  NoteUpdatePayloadSchema,
  NoteQuerySchema,
  NoteParamsSchema
};
