import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      
      message = exceptionResponse.message || exception.message;
      
      if (Array.isArray(message)) {
        errorDetails = message;
        message = 'Validation failed';
      } else {
        errorDetails = exceptionResponse.error || exception.name;
      }
    } else if (exception instanceof Error) {
      errorDetails = exception.message;
    }

    response.status(status).json({
      status: 'error',
      message: message,
      data: null,
      error: errorDetails,
    });
  }
}
