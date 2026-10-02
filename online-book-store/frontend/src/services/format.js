export const formatPrice = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
