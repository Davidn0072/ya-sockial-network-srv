class AppError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}

function parseError(error) {
    return {
        status: error instanceof AppError ? error.status : 500,
        message: error.message || 'Internal Server Error'
    };
}

export { AppError, parseError };
