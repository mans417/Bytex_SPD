import { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSyncTime(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate periodic sync updates when online
    const syncInterval = isOnline ? setInterval(() => {
      setLastSyncTime(new Date());
    }, 30000) : null;

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [isOnline]);

  const formatLastSync = () => {
    const now = new Date();
    const diff = Math.floor((now - lastSyncTime) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
      isOnline 
        ? 'bg-success/10 border-success/20 text-success' :'bg-warning/10 border-warning/20 text-warning'
    }`}>
      <div className="relative">
        <Icon 
          name={isOnline ? 'Wifi' : 'WifiOff'} 
          size={20}
          className="transition-transform duration-250"
        />
        {isOnline && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium caption">
          {isOnline ? 'Online' : 'Offline Mode'}
        </p>
        {isOnline && (
          <p className="text-xs opacity-80 caption">
            Last synced: {formatLastSync()}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;