"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponses = void 0;
exports.errorResponses = {
    badRequest: {
        message: 'Bad request',
        error: {
            name: 'BadRequest',
            statusCode: 400,
            status: 400,
            level: 'error',
            timestamp: new Date().toISOString()
        }
    },
    unauthorized: {
        message: 'Unauthorized',
        error: {
            name: 'Unauthorized',
            statusCode: 401,
            status: 401,
            level: 'error',
            timestamp: new Date().toISOString()
        }
    },
    internal: {
        message: 'Internal server error',
        error: {
            name: 'InternalServerError',
            statusCode: 500,
            status: 500,
            level: 'error',
            timestamp: new Date().toISOString()
        }
    }
};
//# sourceMappingURL=error-response.js.map