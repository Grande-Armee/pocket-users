import { ClsContextService, DtoFactory, TRACE_ID_KEY } from '@grande-armee/pocket-common';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, of, switchMap } from 'rxjs';

import { BrokerResponseDto } from '../dtos/brokerResponseDto';

@Injectable()
export class BrokerInterceptor implements NestInterceptor {
  public constructor(private readonly clsContextService: ClsContextService, private readonly dtoFactory: DtoFactory) {}

  public intercept(executionContext: ExecutionContext, next: CallHandler<any>): any {
    return of(null).pipe(
      switchMap(() => {
        const [content] = executionContext.getArgs<[any]>();

        const namespace = this.clsContextService.getNamespace();

        return namespace.runAndReturn(() => {
          this.clsContextService.set(TRACE_ID_KEY, content?.context?.traceId);

          return next.handle();
        });
      }),
      map((payload) =>
        this.dtoFactory.createDtoInstance(BrokerResponseDto, {
          success: true,
          payload,
        }),
      ),
      catchError((error) => {
        console.log({ error });

        return of(
          this.dtoFactory.createDtoInstance(BrokerResponseDto, {
            success: false,
            payload: error,
          }),
        );
      }),
    );
  }
}
