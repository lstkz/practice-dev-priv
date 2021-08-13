import React from 'react';
import { getCDNUrl } from 'src/common/helper';
import { IS_SSR } from 'src/config';
import { useLayoutEffectFix } from 'src/hooks/useLayoutEffectFix';
import tw, { styled } from 'twin.macro';
import { useChallengeState } from './ChallengeModule';

if (!IS_SSR) {
  window.React = React;
}

const Wrapper = styled.div`
  ${tw`text-gray-300`}

  h1 {
    ${tw`text-xl font-bold leading-7 text-gray-100 mt-2 text-center`}
  }

  h4 {
    ${tw`font-semibold text-gray-100 mt-2`}
  }
  ul {
    ${tw`space-y-1 list-disc`}
    li {
      ${tw`ml-6`}
    }
  }

  p {
    ${tw`mt-2`}
  }
  table {
    ${tw`table-auto mb-2 w-full`}
    th, td {
      ${tw`px-1 py-1 border border-gray-400`}
    }
  }
  code {
    ${tw`bg-black px-1 rounded-sm`}
  }
`;

export function DetailsTab() {
  const { challengeHtml, challenge } = useChallengeState();
  const [details, setDetails] = React.useState<React.ReactNode | null>(null);
  useLayoutEffectFix(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = getCDNUrl(challenge.detailsS3Key);
    (window as any).ChallengeJSONP = (module: any) => {
      setDetails(module.Details);
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);
  return (
    <Wrapper>
      <h1>{challenge.title}</h1>
      {details || <div dangerouslySetInnerHTML={{ __html: challengeHtml }} />}
    </Wrapper>
  );
}
