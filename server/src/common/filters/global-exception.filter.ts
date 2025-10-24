import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 * Global exception filter
 * This filter catches all exceptions thrown by the application and returns a JSON response with detailed information.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * Catch an exception and return a JSON response
   * @param exception The exception to catch
   * @param host The host of the exception
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req = context.getRequest<Request>();
    const res = context.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        message =
          (response as any).message ||
          (response as any).error ||
          exception.message;
      }
    } else if (exception instanceof QueryFailedError) {
      const err: any = exception;
      if (err.code === '23505') {
        status = HttpStatus.CONFLICT;
        message =
          err.detail || 'Duplicate key value violates unique constraint';
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = err.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      console.error('Unexpected Error:', exception.stack);
    }

    res.status(status).json({
      statusCode: status,
      message: message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
