import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Безопасно вытягиваем сообщение без использования типа any
    const errorBody =
      typeof exceptionResponse === 'object' ? exceptionResponse : { message: exceptionResponse };

    // Простой и понятный лог в консоль бэкенда
    this.logger.warn(`${request.method} ${request.url} ${status}`);

    // Отдаем стандартный чистый JSON на фронтенд
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: errorBody,
    });
  }
}
