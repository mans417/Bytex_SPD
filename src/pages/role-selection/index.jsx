import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../context/AuthContext';
import WelcomeHeader from './components/WelcomeHeader';
import RoleCard from './components/RoleCard';
import FeaturesList from './components/FeaturesList';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const roles = [
    {
      id: 'staff',
      role: 'Staff',
      icon: 'UserCircle',
      description: 'Create and manage digital bills for customers',
      color: 'bg-secondary/10 text-secondary',
      route: '/staff-billing'
    },
    {
      id: 'owner',
      role: 'Owner',
      icon: 'BarChart3',
      description: 'Monitor sales and track business performance',
      color: 'bg-primary/10 text-primary',
      route: '/owner-dashboard'
    }
  ];

  const handleRoleSelect = async (route) => {
    setIsTransitioning(true);
    // Logout first to ensure clean state
    await logout();

    // Determine role string from route for login page
    const roleMap = {
      '/staff-billing': 'staff',
      '/owner-dashboard': 'owner'
    };

    setTimeout(() => {
      // Go to login with pre-selected tab
      navigate('/login', { state: { role: roleMap[route] } });
      setIsTransitioning(false);
    }, 250);
  };

  return (
    <>
      <Helmet>
        <title>Role Selection - SmartBill Lite</title>
        <meta name="description" content="Choose your role to access SmartBill Lite - Staff for billing or Owner for sales monitoring" />
      </Helmet>
      <OfflineStatusIndicator />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 lg:space-y-16">
            <WelcomeHeader />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
              {roles?.map((roleData) => (
                <RoleCard
                  key={roleData?.id}
                  role={roleData?.role}
                  icon={roleData?.icon}
                  description={roleData?.description}
                  color={roleData?.color}
                  onSelect={() => handleRoleSelect(roleData?.route)}
                  isTransitioning={isTransitioning}
                />
              ))}
            </div>

            <FeaturesList />

            <div className="text-center space-y-3 md:space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm md:text-base text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>System Online & Ready</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground caption">
                &copy; {new Date()?.getFullYear()} SmartBill Lite. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelection;