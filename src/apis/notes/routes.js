const { 
  NotePayloadSchema, 
  NoteUpdatePayloadSchema, 
  NoteQuerySchema, 
  NoteParamsSchema 
} = require('../../validator/schema');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/notes',
    handler: (request, h) => handler.postNoteHandler(request, h),
    options: {
      description: 'Create a new note',
      tags: ['api', 'notes'],
      validate: {
        payload: NotePayloadSchema,
      },
    },
  },
  {
    method: 'GET',
    path: '/api/notes',
    handler: (request, h) => handler.getNotesHandler(request, h),
    options: {
      description: 'Get all notes with pagination',
      tags: ['api', 'notes'],
      validate: {
        query: NoteQuerySchema,
      },
    },
  },
  {
    method: 'GET',
    path: '/api/notes/{id}',
    handler: (request, h) => handler.getNoteByIdHandler(request, h),
    options: {
      description: 'Get note by ID',
      tags: ['api', 'notes'],
      validate: {
        params: NoteParamsSchema,
      },
    },
  },
  {
    method: 'PUT',
    path: '/api/notes/{id}',
    handler: (request, h) => handler.putNoteByIdHandler(request, h),
    options: {
      description: 'Update note by ID',
      tags: ['api', 'notes'],
      validate: {
        params: NoteParamsSchema,
        payload: NoteUpdatePayloadSchema,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/api/notes/{id}',
    handler: (request, h) => handler.deleteNoteByIdHandler(request, h),
    options: {
      description: 'Delete note by ID',
      tags: ['api', 'notes'],
      validate: {
        params: NoteParamsSchema,
      },
    },
  },
];

module.exports = routes;
