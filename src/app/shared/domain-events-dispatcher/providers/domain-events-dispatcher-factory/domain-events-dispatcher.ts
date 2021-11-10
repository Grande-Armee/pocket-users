import { DomainEvent } from './domain-event';

export class DomainEventsDispatcher {
  // TODO: brokerService
  public constructor(private readonly brokerService: any) {}

  private events: DomainEvent<unknown>[] = [];

  public addEvent(event: DomainEvent<unknown>): void {
    this.events.push(event);
  }

  public getEvents(): DomainEvent<unknown>[] {
    return [...this.events];
  }

  public async dispatch(): Promise<void> {
    await this.events.reduce(async (result, event) => {
      await result;

      return this.brokerService.dispatch(event);
    }, Promise.resolve(null));
  }
}
