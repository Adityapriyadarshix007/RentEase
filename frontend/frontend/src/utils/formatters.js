export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const getDaysRemaining = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day';
  return `${diffDays} days`;
};

export const isDateExpired = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  return date < now;
};

export const isToday = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  return date.getDate() === now.getDate() &&
         date.getMonth() === now.getMonth() &&
         date.getFullYear() === now.getFullYear();
};

export const getRentalStatus = (startDate, endDate, currentStatus) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (currentStatus === 'cancelled') return 'cancelled';
  if (currentStatus === 'pending') return 'pending';
  if (now > end) return 'completed';
  if (now >= start && now <= end) return 'active';
  if (now < start) return 'upcoming';
  return currentStatus || 'pending';
};
