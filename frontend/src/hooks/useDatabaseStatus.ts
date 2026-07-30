import { useState, useCallback } from 'react';
import type { DatabaseStatus } from '@/types/task';
import { apiService } from '@/services/api';

export const useDatabaseStatus = () => {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);

  const checkStatus = useCallback(async () => {
    const status = await apiService.checkHealth();
    setDbStatus(status);
    return status;
  }, []);

  return {
    dbStatus,
    checkStatus,
  };
};
