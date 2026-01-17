import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import app from '../../utils/firebase';
import RoleTransitionHeader from '../../components/ui/RoleTransitionHeader';
import SetupWizard from './components/SetupWizard';
import AuthMethodSelector from './components/AuthMethodSelector';
import CredentialCreation from './components/CredentialCreation';
import SecurityPreferences from './components/SecurityPreferences';
import SetupPreview from './components/SetupPreview';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const SecureLoginSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [setupMode, setSetupMode] = useState('simple');
  const [authMethod, setAuthMethod] = useState('password');
  const [credentials, setCredentials] = useState({
    staff: { email: '', password: '', pin: '' },
    owner: { email: '', password: '', pin: '' }
  });
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxFailedAttempts: 3,
    biometricEnabled: false,
    backupAccess: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  const auth = app ? getAuth(app) : null;

  const steps = [
    { number: 1, title: 'Access Mode', description: 'Choose security level' },
    { number: 2, title: 'Auth Method', description: 'Select authentication type' },
    { number: 3, title: 'Credentials', description: 'Create secure access' },
    { number: 4, title: 'Security', description: 'Configure preferences' },
    { number: 5, title: 'Preview', description: 'Review and confirm' }
  ];

  const handleNext = () => {
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteSetup = async () => {
    if (!app) {
      alert('Firebase is not configured. Please set up Firebase credentials in your .env file.');
      return;
    }

    setIsProcessing(true);

    try {
      const setupConfig = {
        mode: setupMode,
        authMethod,
        credentials: setupMode === 'secure' ? credentials : null,
        securitySettings: setupMode === 'secure' ? securitySettings : null,
        setupDate: new Date()?.toISOString()
      };

      localStorage.setItem('authSetup', JSON.stringify(setupConfig));

      if (setupMode === 'secure' && auth && authMethod === 'password') {
        if (credentials?.owner?.email && credentials?.owner?.password) {
          try {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              credentials?.owner?.email,
              credentials?.owner?.password
            );
            await updateProfile(userCredential?.user, { displayName: 'Owner' });
          } catch (error) {
            console.error('Firebase auth setup error:', error);
          }
        }
      }

      setSetupComplete(true);
      setTimeout(() => {
        navigate('/role-selection');
      }, 2000);
    } catch (error) {
      console.error('Setup error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                Choose Access Mode
              </h2>
              <p className="text-muted-foreground">
                Select how users will access the application
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setSetupMode('simple')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  setupMode === 'simple' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-success/10 text-success">
                    <Icon name="Zap" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Simple Access</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Quick role selection without authentication. Best for trusted environments and ease of use.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-success" />
                    No login required
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-success" />
                    Instant access
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-success" />
                    Easy to use
                  </li>
                </ul>
              </button>

              <button
                onClick={() => setSetupMode('secure')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  setupMode === 'secure' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                    <Icon name="Shield" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Secure Access</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Credential-based authentication with enhanced security. Recommended for sensitive business data.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Password/PIN protection
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Role-specific credentials
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Advanced security options
                  </li>
                </ul>
              </button>
            </div>
          </div>
        );

      case 2:
        return setupMode === 'secure' ? (
          <AuthMethodSelector
            authMethod={authMethod}
            onAuthMethodChange={setAuthMethod}
          />
        ) : null;

      case 3:
        return setupMode === 'secure' ? (
          <CredentialCreation
            authMethod={authMethod}
            credentials={credentials}
            onCredentialsChange={setCredentials}
          />
        ) : null;

      case 4:
        return setupMode === 'secure' ? (
          <SecurityPreferences
            settings={securitySettings}
            onSettingsChange={setSecuritySettings}
          />
        ) : null;

      case 5:
        return (
          <SetupPreview
            setupMode={setupMode}
            authMethod={authMethod}
            credentials={credentials}
            securitySettings={securitySettings}
          />
        );

      default:
        return null;
    }
  };

  const shouldSkipStep = (step) => {
    if (setupMode === 'simple' && step >= 2 && step <= 4) {
      return true;
    }
    return false;
  };

  const getNextStep = () => {
    let next = currentStep + 1;
    while (next <= steps?.length && shouldSkipStep(next)) {
      next++;
    }
    return next <= steps?.length ? next : currentStep;
  };

  const handleSmartNext = () => {
    let next = getNextStep();
    if (next > currentStep) {
      setCurrentStep(next);
    }
  };

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success mx-auto mb-4">
            <Icon name="CheckCircle" size={40} />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Setup Complete!</h2>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Secure Login Setup - SmartBill Lite</title>
        <meta name="description" content="Configure authentication and security settings for your SmartBill Lite application" />
      </Helmet>
      <RoleTransitionHeader />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
                Security Setup
              </h1>
              <p className="text-muted-foreground">
                Configure authentication and access controls
              </p>
            </div>

            {/* Progress Wizard */}
            <SetupWizard
              steps={steps}
              currentStep={currentStep}
              setupMode={setupMode}
            />

            {/* Step Content */}
            <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm mb-6">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isProcessing}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Back
              </Button>

              {currentStep === steps?.length ? (
                <Button
                  onClick={handleCompleteSetup}
                  loading={isProcessing}
                  iconName="Check"
                  iconPosition="right"
                >
                  Complete Setup
                </Button>
              ) : (
                <Button
                  onClick={handleSmartNext}
                  disabled={isProcessing}
                  iconName="ChevronRight"
                  iconPosition="right"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecureLoginSetup;