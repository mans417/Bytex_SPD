import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoleCard = ({ 
  role, 
  icon, 
  description, 
  color, 
  onSelect, 
  isTransitioning 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative bg-card border-2 rounded-xl p-6 md:p-8 lg:p-10 transition-all duration-250 ${
        isHovered ? 'border-primary shadow-lg transform -translate-y-1' : 'border-border shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center text-center gap-4 md:gap-5 lg:gap-6">
        <div
          className={`flex items-center justify-center w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl ${color} transition-transform duration-250 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        >
          <Icon name={icon} size={32} className="md:w-10 md:h-10 lg:w-12 lg:h-12" />
        </div>

        <div className="space-y-2 md:space-y-3">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
            {role}
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-xs">
            {description}
          </p>
        </div>

        <Button
          variant="default"
          size="lg"
          onClick={onSelect}
          disabled={isTransitioning}
          loading={isTransitioning}
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={20}
          className="w-full mt-2 md:mt-3 lg:mt-4"
        >
          Continue as {role}
        </Button>
      </div>
    </div>
  );
};

export default RoleCard;