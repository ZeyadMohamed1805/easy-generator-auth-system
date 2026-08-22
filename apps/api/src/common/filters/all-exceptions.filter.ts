import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

type ExceptionBody = {
  statusCode: number;
  message: string | string[];
  error: string;
  requestId?: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request & { id?: string }>();
    const requestId =
      request.id ??
      (typeof request.headers['x-request-id'] === 'string'
        ? request.headers['x-request-id']
        : undefined);

    const body = this.toBody(exception, requestId);

    if (body.statusCode >= 500) {
      this.logger.error(
        {
          requestId,
          err: exception instanceof Error ? exception : undefined,
        },
        exception instanceof Error ? exception.message : 'Unhandled exception',
      );
    }

    response.status(body.statusCode).json(body);
  }

  private toBody(exception: unknown, requestId?: string): ExceptionBody {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const raw = exception.getResponse();
      if (typeof raw === 'string') {
        return {
          statusCode: status,
          message: raw,
          error: exception.name,
          requestId,
        };
      }
      const payload = raw as {
        message?: string | string[];
        error?: string;
      };
      return {
        statusCode: status,
        message: payload.message ?? exception.message,
        error: payload.error ?? exception.name,
        requestId,
      };
    }

    const isProduction = process.env.NODE_ENV === 'production';
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: isProduction
        ? 'Internal server error'
        : this.hiddenMessage(exception),
      error: 'Internal Server Error',
      requestId,
    };
  }

  private hiddenMessage(exception: unknown): string {
    return exception instanceof Error
      ? exception.message
      : 'Internal server error';
  }
}
