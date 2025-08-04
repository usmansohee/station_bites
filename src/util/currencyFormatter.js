export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatCurrencyWithDecimals = (amount) => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}; 