export abstract class DomainEvent<Payload> {
  public constructor(private readonly payload: Payload) {}

  public abstract readonly name: string;

  public getPayload(): Payload {
    return this.payload;
  }

  public getName(): string {
    return this.name;
  }
}
