import { UserModel } from '../collections/User';
import { User } from '../generated';

export function mapUser(user: UserModel): User {
  return {
    id: user._id.toHexString(),
    email: user.email,
    username: user.username,
    isVerified: user.isVerified,
    isAdmin: user.isAdmin,
    avatarId: user.avatarId,
  };
}
