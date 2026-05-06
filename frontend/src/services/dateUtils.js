import { format, differenceInDays, addMonths, isBefore, isAfter, parseISO, formatDistance } from 'date-fns';

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

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(d, new Date(), { addSuffix: true });
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

// Get months difference between two dates
export const getMonthsDifference = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 30);
};

// Check if date is within range
export const isDateInRange = (date, startDate, endDate) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return !isBefore(d, start) && !isAfter(d, end);
};

// Get week number
export const getWeekNumber = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const start = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
};

// Get month name
export const getMonthName = (date, short = false) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return d.toLocaleString('default', { month: short ? 'short' : 'long' });
};

// Get year
export const getYear = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return d.getFullYear();
};

// Add days to date
export const addDays = (date, days) => {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Subtract days from date
export const subtractDays = (date, days) => {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  d.setDate(d.getDate() - days);
  return d;
};

// Check if two dates are same day
export const isSameDay = (date1, date2) => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
};

// Get age from birthdate
export const getAge = (birthDate) => {
  const bd = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  const ageDifMs = Date.now() - bd.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};