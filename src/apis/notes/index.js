const NotesHandler = require('./handler');
const NotesService = require('../../services/notesService');
const routes = require('./routes');

const notesPlugin = {
  name: 'notes',
  version: '1.0.0',
  register: async (server, { database }) => {
    const notesService = new NotesService(database);
    const notesHandler = new NotesHandler(notesService);

    server.route(routes(notesHandler));
  },
};

module.exports = notesPlugin;
