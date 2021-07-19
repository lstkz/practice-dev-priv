import { getAvatarUrl } from 'src/common/helper';
import tw from 'twin.macro';

interface UserAvatarProps {
  user: { username: string; avatarId?: string | null };
  size?: 'xl' | 'md';
}

export function UserAvatar(props: UserAvatarProps) {
  const { user, size = 'md' } = props;
  const sizeCss = [
    size === 'md' && tw`w-8 h-8`,
    size === 'xl' && tw`w-32 h-32`,
  ];
  return (
    <>
      {user.avatarId ? (
        <img
          tw="relative rounded-full "
          css={[sizeCss]}
          src={getAvatarUrl(user.avatarId, size === 'xl' ? 280 : 80)}
          alt=""
        />
      ) : (
        <div
          tw="bg-blue-600 text-white text-lg leading-none flex items-center justify-center uppercase rounded-full"
          css={[sizeCss, size === 'xl' && tw`text-5xl`]}
        >
          {user.username[0]}
        </div>
      )}
    </>
  );
}
