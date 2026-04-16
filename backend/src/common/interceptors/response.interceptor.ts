import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: string;
  message: string;
  data: T;
  error: null;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        // If the service layer returns an object with a specific message, use it.
        const message = res && res.message ? res.message : 'Success';
        const data = res && res.data !== undefined ? res.data : res;

        return {
          status: 'success',
          message: message,
          data: data,
          error: null,
        };
      }),
    );
  }
}
