// Custom error class for application-specific errors
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Flag to identify operational errors
        Error.captureStackTrace(this, this.constructor);
    }
}

// Global error handler middleware
export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    
    // Log error for debugging (in production, you might want to use a proper logging service)
    console.error(`[ERROR] ${err.stack}`);
    
    // Handle different types of errors
    
    // MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        err.statusCode = 400;
        err.message = `Duplicate value for ${field}: ${value}. Please use another value.`;
    }
    
    // MongoDB validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        err.statusCode = 400;
        err.message = messages.join(', ');
    }
    
    // MongoDB CastError (invalid ID)
    if (err.name === 'CastError') {
        err.statusCode = 400;
        err.message = `Invalid ${err.path}: ${err.value}`;
    }
    
    // JSON Web Token error
    if (err.name === 'JsonWebTokenError') {
        err.statusCode = 401;
        err.message = 'Invalid token. Please log in again.';
    }
    
    // JWT Expired error
    if (err.name === 'TokenExpiredError') {
        err.statusCode = 401;
        err.message = 'Your token has expired. Please log in again.';
    }
    
    // Multer file upload error
    if (err.name === 'MulterError') {
        err.statusCode = 400;
        err.message =  'File upload error occurred';
    }
    
    // Development vs Production error response
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
        // More detailed error for development
        return res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Less detailed error for production (don't expose sensitive info)
        return res.status(err.statusCode).json({
            success: false,
            message: err.isOperational ? err.message : 'Something went wrong'
        });
    }
};

// Function to catch async errors
export const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Export both the ErrorHandler class and middleware functions
export default ErrorHandler;