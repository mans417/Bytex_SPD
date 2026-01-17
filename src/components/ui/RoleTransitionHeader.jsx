import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleTransitionHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleSwitchRole = () => {
    setIsTransitioning(true);
    setShowMenu(false);
    setTimeout(() => {
      navigate('/role-selection');
      setIsTransitioning(false);
    }, 250);
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
    <header className="sticky top-0 z-[100] bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-muted ${currentRole?.color}`}>
              <Icon name={currentRole?.icon} size={20} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-muted-foreground caption">Current Role</p>
              <p className="text-base font-semibold text-foreground">{currentRole?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {menuItems?.length > 0 && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMenu(!showMenu)}
                  iconName="Menu"
                  iconSize={18}
                  className="hidden md:flex"
                >
                  Menu
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMenu(!showMenu)}
                  className="md:hidden"
                >
                  <Icon name="Menu" size={18} />
                </Button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                    {menuItems?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => handleNavigate(item?.path)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors ${
                          location?.pathname === item?.path ? 'bg-muted text-primary' : 'text-foreground'
                        }`}
                      >
                        <Icon name={item?.icon} size={16} />
                        {item?.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleSwitchRole}
              disabled={isTransitioning}
              iconName="RefreshCw"
              iconPosition="left"
              iconSize={16}
              className="transition-all duration-250"
            >
              <span className="hidden sm:inline">Switch Role</span>
              <span className="sm:hidden">Switch</span>
            </Button>
          </div>
        </div>
      </div>
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </header>
  );
};

export default RoleTransitionHeader;