import Icon from '../../../components/AppIcon';

const SetupWizard = ({ steps, currentStep, setupMode }) => {
  const isStepActive = (stepNumber) => stepNumber === currentStep;
  const isStepCompleted = (stepNumber) => stepNumber < currentStep;
  const isStepSkipped = (stepNumber) => {
    return setupMode === 'simple' && stepNumber >= 2 && stepNumber <= 4;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-10">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps?.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps */}
        {steps?.map((step, index) => (
          <div
            key={step?.number}
            className={`flex flex-col items-center ${
              index === 0 ? 'items-start' : index === steps?.length - 1 ? 'items-end' : 'items-center'
            }`}
            style={{ width: `${100 / steps?.length}%` }}
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                isStepCompleted(step?.number)
                  ? 'bg-primary border-primary text-primary-foreground'
                  : isStepActive(step?.number)
                  ? 'bg-card border-primary text-primary'
                  : isStepSkipped(step?.number)
                  ? 'bg-muted border-muted text-muted-foreground opacity-50'
                  : 'bg-card border-border text-muted-foreground'
              }`}
            >
              {isStepCompleted(step?.number) ? (
                <Icon name="Check" size={20} />
              ) : isStepSkipped(step?.number) ? (
                <Icon name="Minus" size={20} />
              ) : (
                <span className="font-semibold">{step?.number}</span>
              )}
            </div>
            <div className="mt-2 text-center hidden md:block">
              <p
                className={`text-sm font-medium ${
                  isStepActive(step?.number)
                    ? 'text-foreground'
                    : isStepSkipped(step?.number)
                    ? 'text-muted-foreground opacity-50'
                    : 'text-muted-foreground'
                }`}
              >
                {step?.title}
              </p>
              <p className="text-xs text-muted-foreground">{step?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetupWizard;