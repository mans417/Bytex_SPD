import { Outlet } from 'react-router-dom';
import RoleTransitionHeader from './RoleTransitionHeader';
import OfflineStatusIndicator from './OfflineStatusIndicator';
import SyncProgressFeedback from './SyncProgressFeedback';

const AppLayout = ({ isSyncing = false, syncProgress = 0, syncError = null }) => {
  return (
    <div className="min-h-screen bg-background">
      <RoleTransitionHeader />
      <OfflineStatusIndicator />
      <SyncProgressFeedback
        isSyncing={isSyncing}
        syncProgress={syncProgress}
        syncError={syncError}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;