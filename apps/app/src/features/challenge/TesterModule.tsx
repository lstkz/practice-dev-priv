import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import WS from 'reconnecting-websocket';
import {
  ChallengeDetails,
  TestInfo,
  Workspace,
  AppSocketMsg,
  NextChallengeInfo,
} from 'shared';
import { updateTestResult } from 'shared/src/utils';
import { API_URL } from 'src/config';
import { api } from 'src/services/api';
import { getAccessToken } from 'src/services/Storage';

interface Actions {
  submit: (indexHtmlS3Key: string) => Promise<void>;
  markAsShared: () => void;
}

interface State {
  isShared: boolean;
  submissionId: string | null;
  isSubmitting: boolean;
  challenge: ChallengeDetails;
  tests: TestInfo[];
  result: 'PASS' | 'FAIL' | null;
  nextChallengeInfo: NextChallengeInfo | null;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

interface TesterModuleProps {
  children: React.ReactNode;
  challenge: ChallengeDetails;
  workspace: Workspace;
}

function _getDefaultTests(challenge: ChallengeDetails) {
  return challenge.tests.map((test, i) => {
    const item: TestInfo = {
      id: i + 1,
      name: test,
      result: 'pending',
      steps: [],
    };
    return item;
  });
}

export function TesterModule(props: TesterModuleProps) {
  const { challenge, children, workspace } = props;
  const defaultTests = React.useMemo(() => {
    return _getDefaultTests(challenge);
  }, [challenge]);
  const [state, setState, getState] = useImmer<State>(
    {
      challenge,
      nextChallengeInfo: null,
      isSubmitting: false,
      tests: defaultTests,
      result: null,
      submissionId: null,
      isShared: false,
    },
    'TesterModule'
  );
  const unsubscribeRef = React.useRef<(() => void) | null>(null);
  const unsubscribe = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  };
  React.useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, []);
  const loadNextChallenge = async () => {
    try {
      const { nextChallengeInfo, challenge } = getState();
      if (nextChallengeInfo) {
        return;
      }
      const next = await api.challenge_getNextChallenge({
        id: challenge.id,
      });
      setState(draft => {
        draft.nextChallengeInfo = next;
      });
    } catch (e) {
      console.error('failed to fetch next challenge', e);
    }
  };
  const actions = useActions<Actions>({
    submit: async indexHtmlS3Key => {
      void loadNextChallenge();
      let submissionId: string = null!;
      let done: () => void = null!;
      setState(draft => {
        draft.result = null;
        draft.isShared = false;
        draft.tests = _getDefaultTests(challenge);
        draft.tests[0].result = 'running';
      });
      const socketUrl =
        API_URL.replace(/^http/, 'ws') +
        '/socket?token=' +
        encodeURIComponent(getAccessToken() ?? '');
      const ws = new WS(socketUrl);
      const onMessage = (e: MessageEvent<any>) => {
        const msg = JSON.parse(e.data) as AppSocketMsg;
        if (msg.type !== 'TestUpdate') {
          return;
        }
        const { messages } = msg.payload;
        setState(draft => {
          messages.forEach(msg => {
            if (msg.meta.submissionId === submissionId) {
              updateTestResult(draft, msg);
            }
          });
        });
        if (messages.some(x => x.type === 'TEST_RESULT')) {
          unsubscribe();
          done();
        }
      };
      ws.addEventListener('message', onMessage);
      unsubscribeRef.current = () => ws.close();
      submissionId = await api.submission_submit({
        workspaceId: workspace.id,
        indexHtmlS3Key,
      });
      setState(draft => {
        draft.submissionId = submissionId;
      });
      return new Promise(resolve => {
        done = resolve;
      });
    },
    markAsShared: () =>
      setState(draft => {
        draft.isShared = true;
      }),
  });

  return (
    <Provider state={state} actions={actions}>
      {children}
    </Provider>
  );
}

export function useTesterActions() {
  return useContext().actions;
}

export function useTesterState() {
  return useContext().state;
}
