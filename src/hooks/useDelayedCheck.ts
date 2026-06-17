import { useEffect } from 'react';
import { useApplicationStore } from '@/store/useApplicationStore';

export const useDelayedCheck = () => {
  const checkDelayed = useApplicationStore(state => state.checkDelayedApplications);
  const delayedApps = useApplicationStore(state => 
    state.applications.filter(a => a.isDelayed)
  );

  useEffect(() => {
    checkDelayed();
    
    const interval = setInterval(() => {
      checkDelayed();
    }, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkDelayed]);

  return {
    delayedApps,
    checkDelayed
  };
};
