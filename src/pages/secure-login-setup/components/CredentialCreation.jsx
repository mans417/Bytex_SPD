import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CredentialCreation = ({ authMethod, credentials, onCredentialsChange }) => {
  const [showPasswords, setShowPasswords] = useState({
    staffPassword: false,
    ownerPassword: false
  });

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, label: 'None', color: 'bg-muted' };
    if (password?.length < 6) return { level: 1, label: 'Weak', color: 'bg-error' };
    if (password?.length < 10) return { level: 2, label: 'Fair', color: 'bg-warning' };
    if (password?.length < 14) return { level: 3, label: 'Good', color: 'bg-success' };
    return { level: 4, label: 'Strong', color: 'bg-primary' };
  };

  const handleCredentialChange = (role, field, value) => {
    onCredentialsChange({
      ...credentials,
      [role]: {
        ...credentials?.[role],
        [field]: value
      }
    });
  };

  const renderPasswordFields = (role, label) => {
    const roleKey = role?.toLowerCase();
    const strength = getPasswordStrength(credentials?.[roleKey]?.password);

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <Input
            type="email"
            placeholder={`${role?.toLowerCase()}@example.com`}
            value={credentials?.[roleKey]?.email || ''}
            onChange={(e) => handleCredentialChange(roleKey, 'email', e?.target?.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPasswords?.[`${roleKey}Password`] ? 'text' : 'password'}
              placeholder="Enter secure password"
              value={credentials?.[roleKey]?.password || ''}
              onChange={(e) => handleCredentialChange(roleKey, 'password', e?.target?.value)}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({
                ...showPasswords,
                [`${roleKey}Password`]: !showPasswords?.[`${roleKey}Password`]
              })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Icon name={showPasswords?.[`${roleKey}Password`] ? 'EyeOff' : 'Eye'} size={18} />
            </button>
          </div>
          {credentials?.[roleKey]?.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Password Strength</span>
                <span className={`text-xs font-medium ${strength?.color?.replace('bg-', 'text-')}`}>
                  {strength?.label}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength?.color} transition-all duration-300`}
                  style={{ width: `${(strength?.level / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPinFields = (role, label) => {
    const roleKey = role?.toLowerCase();

    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          PIN Code (4-6 digits)
        </label>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="Enter PIN"
          value={credentials?.[roleKey]?.pin || ''}
          onChange={(e) => {
            const value = e?.target?.value?.replace(/[^0-9]/g, '');
            handleCredentialChange(roleKey, 'pin', value);
          }}
          className="text-center text-2xl tracking-widest"
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          Create Credentials
        </h2>
        <p className="text-muted-foreground">
          Set up {authMethod === 'password' ? 'passwords' : authMethod === 'pin' ? 'PIN codes' : 'biometric access'} for each role
        </p>
      </div>

      {authMethod === 'biometric' ? (
        <div className="text-center py-12">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mx-auto mb-4">
            <Icon name="Fingerprint" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Biometric Setup</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Biometric authentication will be configured on first login using your device's hardware.
            Make sure your device supports fingerprint or face recognition.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Staff Credentials */}
          <div className="bg-muted/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10 text-secondary">
                <Icon name="UserCircle" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Staff Account</h3>
                <p className="text-sm text-muted-foreground">Billing and history access</p>
              </div>
            </div>
            {authMethod === 'password' ? renderPasswordFields('staff', 'Staff') : renderPinFields('staff', 'Staff')}
          </div>

          {/* Owner Credentials */}
          <div className="bg-muted/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <Icon name="BarChart3" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Owner Account</h3>
                <p className="text-sm text-muted-foreground">Full dashboard access</p>
              </div>
            </div>
            {authMethod === 'password' ? renderPasswordFields('owner', 'Owner') : renderPinFields('owner', 'Owner')}
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialCreation;