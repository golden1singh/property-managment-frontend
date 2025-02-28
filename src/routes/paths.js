// Simple object containing all route paths
const PATHS = {
  // Public routes
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',

  // Main feature routes
  TENANTS: {
    LIST: '/tenants',
    ADD: '/tenants/add',
    EDIT: '/tenants/edit/:id',
    DETAILS: '/tenants/:id'
  },

  ROOMS: {
    LIST: '/rooms',
    ADD: '/rooms/add',
    EDIT: '/rooms/edit/:id',
    DETAILS: '/rooms/:id'
  },

  PAYMENTS: '/payments',
  REPORTS: '/reports',
  UTILITIES: '/utilities',
  PLOTS: '/plots',
  
  READINGS: {
    LIST: '/readings',
    ADD: '/readings/add',
    DETAILS: '/readings/:id'
  },

  RENT_COLLECTION: '/rent-collection',
  SETTINGS: '/settings',
  
  // Error routes
  NOT_FOUND: '*'
};

export default PATHS; 