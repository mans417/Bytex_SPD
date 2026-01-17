import { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const OfflineStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[200]">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-250 ${
          isOnline
            ? 'bg-success text-success-foreground'
            : 'bg-warning text-warning-foreground'
        } ${showNotification ? 'animate-slide-in' : ''}`}
      >
        <div className="relative">
          <Icon
            name={isOnline ? 'Wifi' : 'WifiOff'}
            size={18}
            className="transition-transform duration-250"
          />
          {!isOnline && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-warning-foreground rounded-full animate-pulse" />
          )}
        </div>
        <span className="text-sm font-medium caption hidden sm:inline">
          {isOnline ? 'Online' : 'Offline Mode'}
        </span>
      </div>
    </div>
  );
};

export default OfflineStatusIndicator;