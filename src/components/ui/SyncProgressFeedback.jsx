import { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const SyncProgressFeedback = ({ isSyncing = false, syncProgress = 0, syncError = null }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');

  useEffect(() => {
    if (isSyncing) {
      setIsVisible(true);
      setSyncStatus('syncing');
    } else if (syncError) {
      setSyncStatus('error');
      setTimeout(() => {
        setIsVisible(false);
        setSyncStatus('idle');
      }, 5000);
    } else if (syncProgress === 100) {
      setSyncStatus('success');
      setTimeout(() => {
        setIsVisible(false);
        setSyncStatus('idle');
      }, 2000);
    }
  }, [isSyncing, syncProgress, syncError]);

  if (!isVisible) return null;

  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'syncing':
        return {
          icon: 'RefreshCw',
          text: 'Syncing data...',
          bgColor: 'bg-primary',
          textColor: 'text-primary-foreground',
          iconClass: 'animate-spin',
        };
      case 'success':
        return {
          icon: 'CheckCircle2',
          text: 'Sync complete',
          bgColor: 'bg-success',
          textColor: 'text-success-foreground',
          iconClass: '',
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          text: syncError || 'Sync failed',
          bgColor: 'bg-error',
          textColor: 'text-error-foreground',
          iconClass: '',
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();
  if (!statusConfig) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[300] animate-slide-in">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl ${statusConfig?.bgColor} ${statusConfig?.textColor}`}
      >
        <Icon
          name={statusConfig?.icon}
          size={20}
          className={statusConfig?.iconClass}
        />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium caption">{statusConfig?.text}</span>
          {syncStatus === 'syncing' && syncProgress > 0 && (
            <div className="w-48 h-1.5 bg-primary-foreground/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-foreground rounded-full transition-all duration-250"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncProgressFeedback;