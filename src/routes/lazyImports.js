import { lazy } from 'react';

// Auth
export const LoginPage = lazy(() => import("../modules/auth/LoginPage"));
export const LandingPage = lazy(() => import("../modules/landing/LandingPage"));

// Dashboard
export const Dashboard = lazy(() => import("../modules/dashboard/Dashboard"));

// Payments
export const PaymentPage = lazy(() => import("../modules/payments/PaymentPage"));

// Rooms
export const RoomList = lazy(() => import("../modules/rooms/RoomList"));
export const AddRoom = lazy(() => import("../modules/rooms/AddRoom"));
export const RoomDetail = lazy(() => import("../modules/rooms/RoomDetail"));
export const EditRoom = lazy(() => import("../modules/rooms/EditRoom"));

// Tenants
export const TenantList = lazy(() => import("../modules/tenants/TenantListB"));
export const AddTenant = lazy(() => import("../modules/tenants/AddTenant"));
export const EditTenant = lazy(() => import("../modules/tenants/EditTenant"));
export const TenantDetails = lazy(() => import("../modules/tenants/TenantDetails"));

// Reports & Utilities
export const ReportsPage = lazy(() => import("../modules/reports/ReportsPage"));
export const UtilitiesPage = lazy(() => import("../modules/utilities/UtilitiesPage"));

// Readings
export const AddReading = lazy(() => import("../modules/readings/AddReading"));
export const ReadingList = lazy(() => import("../modules/readings/ReadingList"));
export const ReadingDetails = lazy(() => import("../modules/readings/ReadingDetails"));

// Plots
export const PlotManagement = lazy(() => import("../modules/plots/PlotManagement"));

// Settings
export const SettingsPage = lazy(() => import("../modules/settings/SettingsPage"));

// Rent Collection
export const RentCollectionList = lazy(() => import("../modules/rent/RentCollectionList"));

// Common
export const NotFound = lazy(() => import("../common/NotFound")); 