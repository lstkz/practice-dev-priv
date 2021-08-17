import React from 'react';
import { api } from 'src/services/api';
import { APIService } from './APIService';

export function useS3Refresh(workspaceId: string, apiService: APIService) {
  const intervalRef = React.useRef<any>(null);

  React.useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const ret = await api.workspace_getWorkspaceS3Auth(workspaceId);
      apiService.updateAuth(ret);
    }, 1000 * 60 * 20);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [workspaceId, apiService]);
}
