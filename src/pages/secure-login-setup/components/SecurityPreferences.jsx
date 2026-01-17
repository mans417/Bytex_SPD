import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecurityPreferences = ({ settings, onSettingsChange }) => {
  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const securityOptions = [
    {
      key: 'biometricEnabled',
      title: 'Enable Biometric Backup',
      description: 'Allow fingerprint/face recognition as backup authentication',
      icon: 'Fingerprint'
    },
    {
      key: 'backupAccess',
      title: 'Backup Access Method',
      description: 'Enable recovery access if primary credentials are forgotten',
      icon: 'Key'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          Security Preferences
        </h2>
        <p className="text-muted-foreground">
          Configure additional security settings and policies
        </p>
      </div>

      <div className="space-y-6">
        {/* Session Timeout */}
        <div className="bg-muted/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <Icon name="Clock" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">Session Timeout</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Automatically log out users after period of inactivity
              </p>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="5"
                  max="120"
                  value={settings?.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e?.target?.value) || 30)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Max Failed Attempts */}
        <div className="bg-muted/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-error/10 text-error flex-shrink-0">
              <Icon name="ShieldAlert" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">Failed Login Attempts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Lock account temporarily after consecutive failed login attempts
              </p>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="3"
                  max="10"
                  value={settings?.maxFailedAttempts}
                  onChange={(e) => handleSettingChange('maxFailedAttempts', parseInt(e?.target?.value) || 3)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">attempts before lockout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Options */}
        <div className="space-y-4">
          {securityOptions?.map(option => (
            <div key={option?.key} className="bg-muted/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex-shrink-0">
                  <Icon name={option?.icon} size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{option?.title}</h3>
                    <Checkbox
                      checked={settings?.[option?.key]}
                      onCheckedChange={(checked) => handleSettingChange(option?.key, checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{option?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityPreferences;