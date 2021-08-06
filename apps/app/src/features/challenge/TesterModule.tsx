import { gql, useApolloClient } from '@apollo/client';
import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import { TesterSocketMessage, TestInfo } from 'shared';
import { updateTestResult } from 'shared/src/utils';
import {
  Challenge,
  TestProgressDocument,
  TestProgressSubscriptionResult,
  useSubmitMutation,
  Workspace,
} from 'src/generated';

interface Actions {
  submit: (indexHtmlS3Key: string) => Promise<void>;
}

interface State {
  isSubmitting: boolean;
  challenge: Challenge;
  tests: TestInfo[];
  result: 'PASS' | 'FAIL' | null;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

interface TesterModuleProps {
  children: React.ReactNode;
  challenge: Challenge;
  workspace: Workspace;
}

gql`
  mutation Submit($values: SubmitInput!) {
    submit(values: $values)
  }

  subscription TestProgress($id: String!) {
    testProgress(id: $id)
  }
`;

function _getDefaultTests(challenge: Challenge) {
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
  const { challenge, workspace, children } = props;
  const client = useApolloClient();
  const defaultTests = React.useMemo(() => {
    return _getDefaultTests(challenge);
  }, [challenge]);
  const [state, setState] = useImmer<State>(
    { challenge, isSubmitting: false, tests: defaultTests, result: null },
    'TesterModule'
  );
  const [submit] = useSubmitMutation();
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
  const actions = useActions<Actions>({
    submit: async indexHtmlS3Key => {
      let submissionId: string = null!;
      let done: () => void = null!;
      setState(draft => {
        draft.result = null;
        draft.tests = _getDefaultTests(challenge);
        draft.tests[0].result = 'running';
      });
      const obs = client
        .subscribe({
          query: TestProgressDocument,
          variables: {
            id: challenge.id,
          },
        })
        .subscribe(value => {
          const messages = (value as TestProgressSubscriptionResult).data!
            .testProgress as TesterSocketMessage[];
          setState(draft => {
            messages.forEach(msg => {
              if (msg.meta.id === submissionId) {
                updateTestResult(draft, msg);
              }
            });
          });
          if (messages.some(x => x.type === 'RESULT')) {
            unsubscribe();
            done();
          }
        });
      unsubscribeRef.current = () => obs.unsubscribe();
      submissionId = await submit({
        variables: {
          values: {
            workspaceId: workspace.id,
            indexHtmlS3Key,
          },
        },
      }).then(x => x.data!.submit);
      return new Promise(resolve => {
        done = resolve;
      });
    },
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
