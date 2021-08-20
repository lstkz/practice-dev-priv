import { getAvatarUrl } from 'src/common/helper';
import tw from 'twin.macro';

interface UserAvatarProps {
  user: { username: string; avatarId?: string | null };
  size?: 'xxl' | 'xl' | 'md' | 'lg';
}

export function UserAvatar(props: UserAvatarProps) {
  const { user, size = 'md' } = props;
  const sizeCss = [
    size === 'md' && tw`w-8 h-8`,
    size === 'lg' && tw`w-12 h-12`,
    size === 'xl' && tw`w-16 h-16`,
    size === 'xxl' && tw`w-32 h-32`,
  ];
  return (
    <>
      {user.avatarId ? (
        <img
          tw="relative rounded-full "
          css={[sizeCss]}
          src={getAvatarUrl(user.avatarId, size === 'md' ? 80 : 280)}
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
