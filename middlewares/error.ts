import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';

interface CustomError extends Error {
    statusCode?: number;
}

const errorHandle = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error: CustomError = { ...err };
    error.message = err.message;

    // Log error stack in development
    console.log(err.stack);

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    });
};

export default errorHandle;