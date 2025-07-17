class ResponseHelper {
  static success(h, data, message = 'Success', statusCode = 200) {
    const response = h.response({
      status: 'success',
      message,
      ...(data && { data }),
    });
    response.code(statusCode);
    return response;
  }

  static error(h, message = 'Internal server error', statusCode = 500, details = null) {
    const response = h.response({
      status: 'error',
      message,
      ...(details && process.env.NODE_ENV === 'development' && { details }),
    });
    response.code(statusCode);
    return response;
  }

  static fail(h, message, statusCode = 400) {
    const response = h.response({
      status: 'fail',
      message,
    });
    response.code(statusCode);
    return response;
  }
}

module.exports = ResponseHelper; 