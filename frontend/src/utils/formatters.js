// ========== Format date to DD MMM YYYY ==========
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// ========== Format date with time ==========
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

// ========== Format currency ==========
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

// ========== Get days remaining ==========
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

// ========== Check if date is expired ==========
export const isDateExpired = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  return date < now;
};

// ========== Check if date is today ==========
export const isToday = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  return date.getDate() === now.getDate() &&
         date.getMonth() === now.getMonth() &&
         date.getFullYear() === now.getFullYear();
};

// ========== Get status based on dates ==========
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
