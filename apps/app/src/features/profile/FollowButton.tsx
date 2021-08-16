import React from 'react';
import { Button } from 'src/components/Button';

interface FollowButtonProps {
  isFollowing: boolean;
  onToggle: () => Promise<void>;
}

export function FollowButton(props: FollowButtonProps) {
  const { isFollowing, onToggle } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <Button
      onClick={async () => {
        try {
          setIsLoading(true);
          await onToggle();
        } finally {
          setIsLoading(false);
        }
      }}
      type={isFollowing ? 'white' : 'primary'}
      loading={isLoading}
      className="group"
    >
      {isFollowing ? (
        <>
          <span tw="group-hover:hidden">Following</span>
          <span tw="hidden group-hover:block">Unfollow</span>
        </>
      ) : (
        'Follow'
      )}
    </Button>
  );
}
