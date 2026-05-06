export const RENTAL_TENURE_OPTIONS = [1, 3, 6, 12];

export const PRODUCT_CATEGORIES = {
  FURNITURE: 'Furniture',
  APPLIANCES: 'Appliances'
};

export const PRODUCT_SUB_CATEGORIES = {
  [PRODUCT_CATEGORIES.FURNITURE]: ['Bed', 'Sofa', 'Table', 'Chair', 'Wardrobe', 'Dining Table', 'Bookshelf', 'Cabinet'],
  [PRODUCT_CATEGORIES.APPLIANCES]: ['Fridge', 'Washing Machine', 'TV', 'AC', 'Microwave', 'Water Purifier', 'Air Cooler', 'Chimney']
};

export const RENTAL_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  OVERDUE: 'overdue'
};

export const RENTAL_STATUS_LABELS = {
  pending: 'Pending',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
  overdue: 'Overdue'
};

export const MAINTENANCE_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CANCELLED: 'cancelled'
};

export const MAINTENANCE_STATUS_LABELS = {
  pending: 'Pending',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  cancelled: 'Cancelled'
};

export const MAINTENANCE_TYPES = {
  DAMAGE: 'damage',
  MALFUNCTION: 'malfunction',
  CLEANING: 'cleaning',
  ASSEMBLY: 'assembly',
  REPLACEMENT: 'replacement',
  OTHER: 'other'
};

export const MAINTENANCE_TYPE_LABELS = {
  damage: 'Physical Damage',
  malfunction: 'Malfunction / Not Working',
  cleaning: 'Cleaning Required',
  assembly: 'Assembly / Disassembly',
  replacement: 'Replacement Needed',
  other: 'Other Issue'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  VENDOR: 'vendor'
};

export const DELIVERY_SLOTS = [
  { value: 'morning', label: 'Morning (9 AM - 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 4 PM)' },
  { value: 'evening', label: 'Evening (4 PM - 8 PM)' }
];

export const PAYMENT_METHODS = [
  { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { value: 'upi', label: 'UPI', icon: '📱' },
  { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { value: 'cod', label: 'Cash on Delivery', icon: '💰' }
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    UPDATE_PASSWORD: '/auth/password'
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: '/products/:id',
    GET_FEATURED: '/products/featured',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id'
  },
  RENTALS: {
    CREATE: '/rentals',
    GET_MY_RENTALS: '/rentals/my-rentals',
    GET_BY_ID: '/rentals/:id',
    CANCEL: '/rentals/:id/cancel',
    EXTEND: '/rentals/:id/extend',
    GET_ALL: '/rentals',
    UPDATE_STATUS: '/rentals/:id/status'
  },
  MAINTENANCE: {
    CREATE: '/maintenance',
    GET_MY_REQUESTS: '/maintenance/my-requests',
    GET_BY_ID: '/maintenance/:id',
    GET_ALL: '/maintenance',
    UPDATE_STATUS: '/maintenance/:id/status',
    DELETE: '/maintenance/:id'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER_BY_ID: '/admin/users/:id',
    ANALYTICS: '/admin/analytics'
  },
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_BY_ID: '/categories/:id',
    CREATE: '/categories',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id'
  },
  PAYMENTS: {
    CREATE_INTENT: '/payments/create-intent',
    CONFIRM: '/payments/confirm',
    HISTORY: '/payments/history'
  }
};