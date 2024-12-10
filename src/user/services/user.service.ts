import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDao } from '../daos/user.dao';
import { BaseTransaction } from 'src/database/base.transaction';

@Injectable()
export class UserService {
  constructor(
    private readonly config: ConfigService, 
    private readonly userDao: UserDao
  ) {}

  async doTransaction() {
    // create transaction
    await this.userDao.transaction(async (trx: BaseTransaction<any>) => {
      // create new instance using transaction
      const t = this.userDao.transacting(trx);

      await t.create({});
      await t.findByEmail('test@example.com');
    })
    
    // Tranaction will commit unless error is thrown
  }
}
