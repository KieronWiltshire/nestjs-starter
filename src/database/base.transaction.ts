export class BaseTransaction<T> {
  constructor(readonly transaction: T) {}

  public instance(): T {
    return this.transaction;
  }
}
