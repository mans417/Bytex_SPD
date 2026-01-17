
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  return (
    <div className="text-center space-y-4 md:space-y-5 lg:space-y-6">
      <div className="flex justify-center">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl bg-primary">
            <Icon name="Receipt" size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            SmartBill Lite
          </h1>
        </div>
      </div>

      <div className="space-y-2 md:space-y-3">
        <p className="text-lg md:text-xl lg:text-2xl font-medium text-foreground">
          Welcome to Digital Billing
        </p>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Choose your role to access the billing system. Staff can create bills instantly, while Owners can monitor sales in real-time.
        </p>
      </div>
    </div>
  );
};

export default WelcomeHeader;