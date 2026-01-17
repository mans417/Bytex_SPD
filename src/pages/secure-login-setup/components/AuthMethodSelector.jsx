import Icon from '../../../components/AppIcon';

const AuthMethodSelector = ({ authMethod, onAuthMethodChange }) => {
  const methods = [
    {
      value: 'password',
      title: 'Password',
      icon: 'Lock',
      description: 'Traditional password-based authentication with email',
      features: ['Strong encryption', 'Password recovery', 'Multi-device support']
    },
    {
      value: 'pin',
      title: 'PIN Code',
      icon: 'Hash',
      description: 'Quick 4-6 digit PIN for fast access',
      features: ['Fast login', 'Easy to remember', 'Numeric keypad']
    },
    {
      value: 'biometric',
      title: 'Biometric',
      icon: 'Fingerprint',
      description: 'Fingerprint or face recognition (device dependent)',
      features: ['Most secure', 'No password needed', 'Device hardware required']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          Select Authentication Method
        </h2>
        <p className="text-muted-foreground">
          Choose how users will verify their identity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {methods?.map(method => (
          <button
            key={method?.value}
            onClick={() => onAuthMethodChange(method?.value)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              authMethod === method?.value
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center text-center mb-4">
              <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                authMethod === method?.value
                  ? 'bg-primary/10 text-primary' :'bg-muted text-muted-foreground'
              }`}>
                <Icon name={method?.icon} size={28} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{method?.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{method?.description}</p>
            </div>
            <ul className="space-y-2">
              {method?.features?.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Check" size={14} className="text-success" />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AuthMethodSelector;