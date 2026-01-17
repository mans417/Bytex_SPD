import Icon from '../../../components/AppIcon';

const FeaturesList = () => {
  const features = [
    {
      icon: "Zap",
      title: "Instant Billing",
      description: "Create digital bills in seconds with auto-calculation"
    },
    {
      icon: "WifiOff",
      title: "Offline First",
      description: "Works without internet, syncs automatically when online"
    },
    {
      icon: "BarChart3",
      title: "Real-time Monitoring",
      description: "Track sales and transactions as they happen"
    },
    {
      icon: "Shield",
      title: "Secure & Reliable",
      description: "Your data is protected with automatic backups"
    }
  ];

  return (
    <div className="bg-muted rounded-xl p-6 md:p-8 lg:p-10">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground text-center mb-6 md:mb-8 lg:mb-10">
        Key Features
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        {features?.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-3 md:gap-4 p-4 md:p-5 lg:p-6 bg-card rounded-lg border border-border hover:border-primary transition-all duration-250"
          >
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <Icon name={feature?.icon} size={20} className="md:w-6 md:h-6" />
            </div>
            <div className="space-y-1 md:space-y-2">
              <h4 className="text-base md:text-lg lg:text-xl font-medium text-foreground">
                {feature?.title}
              </h4>
              <p className="text-sm md:text-base text-muted-foreground">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesList;