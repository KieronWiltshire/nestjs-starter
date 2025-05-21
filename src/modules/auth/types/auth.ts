import { UserDto } from '@/modules/user/dtos/user.dto';
import { ApiKeyDto } from '@/modules/api-key/dtos/api-key.dto';

export enum AuthType {
  Anonymous = 'anon',
  User = 'user',
  ApiKey = 'api-key',
}

type BaseAuth = {
  type: AuthType;
};

export type AnonAuth = BaseAuth & {
  type: AuthType.Anonymous;
};

export type AuthWithSubject = BaseAuth & {
  subjectId: string;
};

export type UserAuth = AuthWithSubject & {
  type: AuthType.User;
  user: UserDto;
};

export type ApiKeyAuth = AuthWithSubject & {
  type: AuthType.ApiKey;
  apiKey: ApiKeyDto;
  user: UserDto;
};

export type Auth = AnonAuth | UserAuth | ApiKeyAuth;
