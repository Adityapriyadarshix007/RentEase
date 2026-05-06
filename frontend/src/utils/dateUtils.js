import { format, differenceInDays, addMonths, isBefore, isAfter, parseISO } from 'date-fns';

// Format date to display string
export const formatDate = (date, formatStr = 'dd MMM yyyy') => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
};

// Format date with time
export const formatDateTime = (date, formatStr = 'dd MMM yyyy, hh:mm a') => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
};

// Get days remaining until end date
export const getDaysRemaining = (endDate) => {
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const today = new Date();
  return differenceInDays(end, today);
};

// Check if rental is active
export const isRentalActive = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const today = new Date();
  return !isBefore(today, start) && !isAfter(today, end);
};

// Calculate rental end date
export const calculateEndDate = (startDate, months) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  return addMonths(start, months);
};

// Get relative time (e.g., "2 days ago")
export const getRelativeTime = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffDays = differenceInDays(now, d);
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

// Check if date is in past
export const isPastDate = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(d, new Date());
};

// Check if date is in future
export const isFutureDate = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isAfter(d, new Date());
};

// Get date range string
export const getDateRangeString = (startDate, endDate) => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

// Get next available date (minimum tomorrow)
export const getNextAvailableDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

// Get age in months between two dates
export const getMonthsDifference = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 30);
};