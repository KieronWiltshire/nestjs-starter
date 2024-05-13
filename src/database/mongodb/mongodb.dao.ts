import {
  ClientSession,
  ClientSessionOptions,
  Db,
  EndSessionOptions,
  MongoClient,
  TransactionOptions,
} from 'mongodb';
import { BaseTransaction } from '../base.transaction';
import { InjectClient, InjectDb } from 'nest-mongodb';
import { Optional } from '@nestjs/common';

type MongodbTransactionOptions = {
  startSessionOptions?: ClientSessionOptions;
  transactionOptions?: TransactionOptions;
  endSessionOptions?: EndSessionOptions;
};

export abstract class MongodbDao<T extends MongodbDao<T>> {
  private readonly createInstance: new (
    mongodb: MongoClient,
    db: Db,
    mongoSession?: ClientSession,
  ) => T;

  constructor(
    @InjectClient() protected readonly mongodb: MongoClient,
    @InjectDb() protected readonly db: Db,
    @Optional() protected readonly mongoSession?: ClientSession,
  ) {}

  async transaction<T>(
    callback: (transaction: BaseTransaction<ClientSession>) => Promise<T>,
    options: MongodbTransactionOptions,
  ) {
    const session = this.mongodb.startSession(options.startSessionOptions);

    try {
      await session.withTransaction(async () => {
        const baseTransaction = new BaseTransaction(session);
        await callback(baseTransaction);
      }, options.transactionOptions);
    } finally {
      return await session.endSession(options.endSessionOptions);
    }
  }

  transacting(transaction: BaseTransaction<ClientSession>): T {
    return new this.createInstance(
      this.mongodb,
      this.db,
      transaction.instance(),
    );
  }
}
