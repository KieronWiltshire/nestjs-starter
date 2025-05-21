import { UserDto } from '@/modules/user/dtos/user.dto';
import { OmitType } from '@nestjs/mapped-types';

export class CreateUserDto extends OmitType(UserDto, ['id'] as const) {}
