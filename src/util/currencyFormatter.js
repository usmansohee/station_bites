export const formatCurrency = (amount) => {
  return `$${amount.toLocaleString('en-US')}`;
};

export const formatCurrencyWithDecimals = (amount) => {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}; 