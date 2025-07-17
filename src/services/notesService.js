const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');

class NotesService {
  constructor(database) {
    this._db = database;
  }

  async addNote({ title, body }) {
    try {
      const id = `note-${nanoid(16)}`;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      const query = {
        text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [id, title, body, createdAt, updatedAt],
      };
      
      const result = await this._db.query(query);
      
      if (!result.rows.length) {
        throw new InvariantError('Note failed to be added');
      }

      return result.rows[0].id;
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new InvariantError('Note with this ID already exists');
      } else if (error.code === '42P01') { // Table doesn't exist
        throw new InvariantError('Notes table does not exist. Please run migrations first.');
      }
      throw error;
    }
  }

  async getNotes(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const query = {
        text: 'SELECT id, title, body, created_at, updated_at FROM notes ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        values: [limit, offset],
      };

      const countQuery = {
        text: 'SELECT COUNT(*) FROM notes',
        values: [],
      };

      const [result, countResult] = await Promise.all([
        this._db.query(query),
        this._db.query(countQuery)
      ]);

      const totalNotes = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalNotes / limit);

      const notes = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        body: row.body,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      const pagination = {
        page,
        limit,
        totalNotes,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };

      return {
        notes,
        pagination
      };
    } catch (error) {
      throw error;
    }
  }

  async getNoteById(id) {
    const query = {
      text: 'SELECT id, title, body, created_at, updated_at FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this._db.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Note not found');
    }

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      body: row.body,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async editNoteById(id, { title, body }) {
    const updatedAt = new Date().toISOString();
    
    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [title, body, updatedAt, id],
    };

    const result = await this._db.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to update note. Note not found');
    }
  }

  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._db.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to delete note. Note not found');
    }
  }
}

module.exports = NotesService;
