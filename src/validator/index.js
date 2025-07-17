const InvariantError = require('../exceptions/InvariantError');
const { 
  NotePayloadSchema, 
  NoteUpdatePayloadSchema, 
  NoteQuerySchema, 
  NoteParamsSchema 
} = require('./schema');

const NotesValidator = {
  validateNotePayload: (payload) => {
    const validationResult = NotePayloadSchema.validate(payload);
    
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateNoteUpdatePayload: (payload) => {
    const validationResult = NoteUpdatePayloadSchema.validate(payload);
    
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = NotesValidator;
