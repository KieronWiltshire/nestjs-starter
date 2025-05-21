import { UserDto } from '@/modules/user/dtos/user.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ['id'] as const),
) {}
