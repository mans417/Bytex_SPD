import React from 'react';
import * as LucideIcons from 'lucide-react';

const AppIcon = ({ name, size = 24, className = '', ...props }) => {
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return <IconComponent size={size} className={className} {...props} />;
};

export default AppIcon;
