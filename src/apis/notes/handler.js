const NotesValidator = require('../../validator');
const ResponseHelper = require('../../utils/responseHelper');

class NotesHandler {
  constructor(notesService) {
    this._notesService = notesService;
  }

  async postNoteHandler(request, h) {
    try {
      NotesValidator.validateNotePayload(request.payload);

      const { title, body } = request.payload;
      const noteId = await this._notesService.addNote({ title, body });

      return ResponseHelper.success(h, { id: noteId }, 'Note created successfully', 201);
    } catch (error) {
      if (error.name === 'InvariantError') {
        return ResponseHelper.fail(h, error.message, 400);
      }

      return ResponseHelper.error(h, 'Internal server error', 500, error.message);
    }
  }

  async getNotesHandler(request, h) {
    try {
      const { page = 1, limit = 10 } = request.query;
      const result = await this._notesService.getNotes(parseInt(page), parseInt(limit));

      return ResponseHelper.success(h, {
        notes: result.notes,
        pagination: result.pagination,
      });
    } catch (error) {
      return ResponseHelper.error(h, 'Internal server error', 500, error.message);
    }
  }

  async getNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const note = await this._notesService.getNoteById(id);

      return ResponseHelper.success(h, { note });
    } catch (error) {
      if (error.name === 'InvariantError') {
        return ResponseHelper.fail(h, error.message, 404);
      }

      return ResponseHelper.error(h, 'Internal server error', 500);
    }
  }

  async putNoteByIdHandler(request, h) {
    try {
      NotesValidator.validateNoteUpdatePayload(request.payload);

      const { id } = request.params;
      const { title, body } = request.payload;

      await this._notesService.editNoteById(id, { title, body });

      return ResponseHelper.success(h, null, 'Note updated successfully');
    } catch (error) {
      if (error.name === 'InvariantError') {
        return ResponseHelper.fail(h, error.message, error.message.includes('not found') ? 404 : 400);
      }

      return ResponseHelper.error(h, 'Internal server error', 500);
    }
  }

  async deleteNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._notesService.deleteNoteById(id);

      return ResponseHelper.success(h, null, 'Note deleted successfully');
    } catch (error) {
      if (error.name === 'InvariantError') {
        return ResponseHelper.fail(h, error.message, 404);
      }

      return ResponseHelper.error(h, 'Internal server error', 500);
    }
  }
}

module.exports = NotesHandler;
