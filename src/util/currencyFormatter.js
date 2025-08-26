export const formatCurrency = (amount) => {
  return `£${amount.toLocaleString('en-GB')}`;
};

export const formatCurrencyWithDecimals = (amount) => {
  return `£${amount.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}; 