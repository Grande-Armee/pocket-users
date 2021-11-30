import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';

import { UserTransporter } from './domain/user/userTransporter';
import { BrokerInterceptor } from './interceptors/brokerInterceptor';
import { BrokerService } from './services/broker/brokerService';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'exchange1',
          type: 'topic',
        },
      ],
      uri: 'amqp://username:password@rabbitmq:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [BrokerInterceptor, BrokerService, UserTransporter],
  exports: [RabbitMQModule, BrokerInterceptor, BrokerService, UserTransporter],
})
export class BrokerModule {}
