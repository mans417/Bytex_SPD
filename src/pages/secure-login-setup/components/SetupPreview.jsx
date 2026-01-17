import Icon from '../../../components/AppIcon';

const SetupPreview = ({ setupMode, authMethod, credentials, securitySettings }) => {
  const getAuthMethodLabel = () => {
    switch (authMethod) {
      case 'password': return 'Password Authentication';
      case 'pin': return 'PIN Code';
      case 'biometric': return 'Biometric (Fingerprint/Face)';
      default: return 'Not configured';
    }
  };

  const previewSections = [
    {
      title: 'Access Mode',
      icon: setupMode === 'simple' ? 'Zap' : 'Shield',
      iconColor: setupMode === 'simple' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary',
      items: [
        { label: 'Mode', value: setupMode === 'simple' ? 'Simple Access' : 'Secure Access' },
        { label: 'Description', value: setupMode === 'simple' ? 'Quick role selection without authentication' : 'Credential-based authentication with enhanced security' }
      ]
    }
  ];

  if (setupMode === 'secure') {
    previewSections?.push(
      {
        title: 'Authentication Method',
        icon: 'Lock',
        iconColor: 'bg-secondary/10 text-secondary',
        items: [
          { label: 'Method', value: getAuthMethodLabel() },
          { label: 'Staff Configured', value: authMethod === 'password' ? (credentials?.staff?.email ? 'Yes' : 'No') : (credentials?.staff?.pin ? 'Yes' : 'No') },
          { label: 'Owner Configured', value: authMethod === 'password' ? (credentials?.owner?.email ? 'Yes' : 'No') : (credentials?.owner?.pin ? 'Yes' : 'No') }
        ]
      },
      {
        title: 'Security Settings',
        icon: 'ShieldCheck',
        iconColor: 'bg-primary/10 text-primary',
        items: [
          { label: 'Session Timeout', value: `${securitySettings?.sessionTimeout} minutes` },
          { label: 'Max Failed Attempts', value: `${securitySettings?.maxFailedAttempts} attempts` },
          { label: 'Biometric Backup', value: securitySettings?.biometricEnabled ? 'Enabled' : 'Disabled' },
          { label: 'Backup Access', value: securitySettings?.backupAccess ? 'Enabled' : 'Disabled' }
        ]
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          Review Configuration
        </h2>
        <p className="text-muted-foreground">
          Verify your security settings before completing setup
        </p>
      </div>

      <div className="space-y-6">
        {previewSections?.map((section, index) => (
          <div key={index} className="bg-muted/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${section?.iconColor}`}>
                <Icon name={section?.icon} size={20} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{section?.title}</h3>
            </div>
            <div className="space-y-3">
              {section?.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{item?.label}</span>
                  <span className="text-sm font-medium text-foreground">{item?.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Important Notes</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Configuration will be saved to local storage</li>
              {setupMode === 'secure' && authMethod === 'password' && (
                <li>• Firebase Authentication will be initialized for password-based login</li>
              )}
              <li>• You can change these settings later from the application settings</li>
              <li>• Make sure to remember your credentials for secure access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupPreview;