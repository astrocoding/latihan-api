const Hapi = require('@hapi/hapi');
const pool = require('./utils/database');

require('dotenv').config({ quiet: true });

const notesPlugin = require('./apis/notes');

const init = async () => {

  // Test database connection
  try {
    await pool.query('SELECT NOW()');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }

  // Server configuration
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with'],
      },
      // Optimize for production
      timeout: {
        server: process.env.NODE_ENV === 'production' ? 30000 : 60000,
        socket: process.env.NODE_ENV === 'production' ? 30000 : 60000,
      },
    },
    // Compression for better performance
    compression: process.env.NODE_ENV === 'production',
  });

  // Register plugins
  await server.register({
    plugin: notesPlugin,
    options: { database: pool },
  });

  // Root endpoint
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return {
        status: 'success',
        message: 'Notes API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    },
    options: {
      description: 'Root endpoint to check if API is running',
      tags: ['api'],
    },
  });

  // Health check endpoint
  server.route({
    method: 'GET',
    path: '/health',
    handler: async (request, h) => {
      try {
        // Test database connection
        await pool.query('SELECT NOW()');
        
        return {
          status: 'success',
          message: 'Service is healthy',
          timestamp: new Date().toISOString(),
          database: 'connected',
          uptime: process.uptime(),
        };
      } catch (error) {
        const response = h.response({
          status: 'error',
          message: 'Service is unhealthy',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
          error: error.message,
        });
        response.code(503);
        return response;
      }
    },
    options: {
      description: 'Health check endpoint',
      tags: ['api'],
    },
  });

  // Error handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response.isBoom) {
      const statusCode = response.output.statusCode;
      const message = response.output.payload.message;

      if (process.env.NODE_ENV === 'development') {
        console.error('Boom error:', {
          statusCode,
          message,
          url: request.url.path,
          method: request.method
        });
      }

      return h.response({
        status: 'error',
        message: statusCode === 404 ? 'Resource not found' : message,
        timestamp: new Date().toISOString(),
      }).code(statusCode);
    }

    return h.continue;
  });

  await server.start();
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server running at: ${server.info.uri}`);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

init();
