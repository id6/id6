import { User } from '../db/entities/user';
import { getPictureUrl } from './utils/get-picture-url';

export async function serializeUser(user: User) {
  return {
    id: user.id,
    authType: user.authProvider,
    name: user.name,
    email: user.email,
    bio: user.bio,
    picture: getPictureUrl(user.picture),
    language: user.language,
  };
}
