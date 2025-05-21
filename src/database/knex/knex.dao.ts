import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { BaseTransaction } from '@/database/base.transaction';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class KnexDao<T extends KnexDao<T>> {
  private readonly createInstance: new (knex: Knex) => T;

  constructor(@InjectConnection() protected readonly knex: Knex) {}

  async transaction<T>(
    callback: (transaction: BaseTransaction<Knex.Transaction>) => Promise<T>,
  ) {
    return await this.knex.transaction(async (knexTransaction) => {
      const baseTransaction = new BaseTransaction(knexTransaction);
      return callback(baseTransaction);
    });
  }

  transacting(transaction: BaseTransaction<Knex.Transaction>): T {
    return new this.createInstance(transaction.instance());
  }
}