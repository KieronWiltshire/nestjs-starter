import { Controller, Get, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../services/user.service';

@Controller()
export class UserController {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get('/hello')
  async hello() {
    return { hello: 'world' };
  }

  @Get('/world')
  async world(@Request() req) {
    return JSON.stringify({
      headers: req.headers,
    });
  }
}
