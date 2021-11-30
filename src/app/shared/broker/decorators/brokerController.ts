import { Injectable, UseInterceptors } from '@nestjs/common';

import { BrokerInterceptor } from '../interceptors/brokerInterceptor';
import { applyDecorators } from './applyDecorators';

export function BrokerController(): ClassDecorator {
  return applyDecorators([UseInterceptors(BrokerInterceptor), Injectable()]);
}
