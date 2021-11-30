import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';

import { applyDecorators } from './applyDecorators';

export function RpcRoute(routingKey: string): MethodDecorator {
  return applyDecorators([
    RabbitRPC({
      exchange: 'exchange1',
      routingKey,
      queue: 'pocket-users-rpc-queue',
    }),
  ]);
}
