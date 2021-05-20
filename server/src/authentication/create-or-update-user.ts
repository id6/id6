import { User } from '../db/entities/user';
import { Logger } from '../commons/logger/logger';

const logger = new Logger('id6.api:createOrUpdateUser');

export interface PassportUser {
  authProvider: string;
  externalUserId: any;
  email: string;
  name?: string;
  bio?: string;
  picture?: string;
  language?: string;
}

export async function createOrUpdateUser(passportUser: PassportUser): Promise<User> {
  logger.debug('passportUser', passportUser);

  const user = await User.findOne({
    where: {
      authProvider: passportUser.authProvider,
      externalUserId: `${passportUser.externalUserId}`,
    },
  });

  if (user) {
    return user;
  }

  const { identifiers } = await User.insert({
    authProvider: passportUser.authProvider,
    externalUserId: `${passportUser.externalUserId}`,
    name: passportUser.name,
    email: passportUser.email,
    bio: passportUser.bio,
    language: passportUser.language || 'en',
    picture: passportUser.picture,
  });

  return User.findOne(identifiers[0]);
}
