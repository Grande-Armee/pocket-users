import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ClsContextService, DtoFactory, TRACE_ID_KEY } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

import { BrokerMessageDataDto } from '../../dtos/brokerMessageDataDto';
import { BrokerMessageDto } from '../../dtos/brokerMessageDto';
import { BrokerResponseDto } from '../../dtos/brokerResponseDto';
import { BrokerMessage } from '../../types';

@Injectable()
export class BrokerService {
  public constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly dtoFactory: DtoFactory,
    private readonly clsContextService: ClsContextService,
  ) {}

  public async parseMessage<Payload>(
    payloadDtoConstructor: ClassConstructor<Payload>,
    message: BrokerMessage,
  ): Promise<BrokerMessageDto> {
    const content = JSON.parse(message.content.toString());

    const messageDto = this.dtoFactory.createDtoInstance<BrokerMessageDto>(BrokerMessageDto, content);
    const payload = this.dtoFactory.createDtoInstance<Payload>(payloadDtoConstructor, messageDto.data.payload);

    return this.dtoFactory.createDtoInstance(BrokerMessageDto, {
      ...messageDto,
      data: {
        ...messageDto.data,
        payload,
      },
    });
  }

  private createMessageDto(data: BrokerMessageDataDto): BrokerMessageDto {
    const traceId = this.clsContextService.get<string>(TRACE_ID_KEY) || '';

    return this.dtoFactory.createDtoInstance(BrokerMessageDto, {
      data,
      context: {
        traceId,
        timestamp: String(Date.now()),
      },
    });
  }

  public createRpcData<Payload>(
    PayloadDtoConstructor: ClassConstructor<Payload>,
    payload: Payload,
  ): BrokerMessageDataDto {
    const payloadDto = this.dtoFactory.createDtoInstance(PayloadDtoConstructor, payload);

    return this.dtoFactory.createDtoInstance(BrokerMessageDataDto, {
      id: 'id',
      timestamp: String(Date.now()),
      payload: payloadDto,
    });
  }

  public async publish(routingKey: string, data: BrokerMessageDataDto): Promise<void> {
    const messageDto = this.createMessageDto(data);

    return this.amqpConnection.publish('exchange1', routingKey, messageDto);
  }

  public async request<Response>(routingKey: string, data: BrokerMessageDataDto): Promise<Response> {
    const messageDto = this.createMessageDto(data);

    const response = await this.amqpConnection.request<BrokerResponseDto>({
      exchange: 'exchange1',
      routingKey,
      payload: messageDto,
      timeout: 25000,
    });

    console.log({ response });

    if (!response.success) {
      // TODO: better handling
      throw new Error('RPC failed.');
    }

    return response.payload as any as Response;
  }
}
