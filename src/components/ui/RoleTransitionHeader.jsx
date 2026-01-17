import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const RoleTransitionHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getCurrentRole = () => {
    if (location?.pathname?.includes('/staff-billing') || location?.pathname?.includes('/staff-bill-history')) {
      return { name: 'Staff', icon: 'UserCircle', color: 'text-secondary' };
    }
    if (location?.pathname?.includes('/owner-dashboard') || location?.pathname?.includes('/sales-analytics')) {
      return { name: 'Owner', icon: 'BarChart3', color: 'text-primary' };
    }
    if (location?.pathname?.includes('/secure-login-setup')) {
      return { name: 'Setup', icon: 'Settings', color: 'text-accent' };
    }
    return null;
  };

  const currentRole = getCurrentRole();

  const handleSwitchRole = async () => {
    setIsTransitioning(true);
    setShowMenu(false);
    // Logout first to clear auth state
    await logout();
    setTimeout(() => {
      navigate('/role-selection');
      setIsTransitioning(false);
    }, 250);
  };

  const handleLogout = async () => {
    setShowMenu(false);
    await logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    setShowMenu(false);
    navigate(path);
  };

  const ownerMenuItems = [
    { label: 'Dashboard', path: '/owner-dashboard', icon: 'BarChart3' },
    { label: 'Analytics', path: '/sales-analytics', icon: 'TrendingUp' },
    { label: 'Security Setup', path: '/secure-login-setup', icon: 'Shield' }
  ];

  const staffMenuItems = [
    { label: 'Billing', path: '/staff-billing', icon: 'Receipt' },
    { label: 'Bill History', path: '/staff-bill-history', icon: 'History' }
  ];

  const menuItems = currentRole?.name === 'Owner' ? ownerMenuItems : currentRole?.name === 'Staff' ? staffMenuItems : [];

  if (!currentRole) return null;

  return (
    <>
      <header className="sticky top-0 z-[100] bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-muted ${currentRole?.color}`}>
                <Icon name={currentRole?.icon} size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Role</p>
                <p className="text-sm font-semibold text-foreground">{currentRole?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {menuItems?.length > 0 && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMenu(!showMenu)}
                    className="h-10 w-10 p-2"
                  >
                    <Icon name="Menu" size={18} />
                  </Button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                      {menuItems?.map((item) => (
                        <button
                          key={item?.path}
                          onClick={() => handleNavigate(item?.path)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors ${location?.pathname === item?.path ? 'bg-muted text-primary' : 'text-foreground'
                            }`}
                        >
                          <Icon name={item?.icon} size={16} />
                          {item?.label}
                        </button>
                      ))}
                      <div className="border-t border-border my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <Icon name="LogOut" size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={handleSwitchRole}
                disabled={isTransitioning}
                className="h-10 w-10 p-2 ml-2"
                title="Switch Role"
              >
                <Icon name="RefreshCw" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

export default RoleTransitionHeader;