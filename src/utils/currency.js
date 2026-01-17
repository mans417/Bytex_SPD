export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })?.format(amount);
};

export const formatCurrencyCompact = (amount) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000)?.toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000)?.toFixed(2)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000)?.toFixed(2)}K`;
  }
  return formatCurrency(amount);
};