export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '0';
    return Number(amount).toLocaleString('en-IN');
};
