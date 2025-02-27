import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../components/layout/DashboardLayout";

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
  </div>
);

// Lazy load components
const LoginPage = lazy(() => import("../features/auth/LoginPage"));
const LandingPage = lazy(() => import("../features/landing/LandingPage"));
const Dashboard = lazy(() => import("../features/dashboard/Dashboard"));
const PaymentPage = lazy(() => import("../features/payments/PaymentPage"));
const RoomList = lazy(() => import("../features/rooms/RoomList"));
const AddRoom = lazy(() => import("../features/rooms/AddRoom"));
const TenantList = lazy(() => import("../features/tenants/TenantListB"));
const AddTenant = lazy(() => import("../features/tenants/AddTenant"));
const EditTenant = lazy(() => import("../features/tenants/EditTenant"));
const TenantDetails = lazy(() => import("../features/tenants/TenantDetails"));
const ReportsPage = lazy(() => import("../features/reports/ReportsPage"));
const UtilitiesPage = lazy(() => import("../features/utilities/UtilitiesPage"));
const NotFound = lazy(() => import("../components/common/NotFound"));
const SettingsPage = lazy(() => import("../features/settings/SettingsPage"));
const AddReading = lazy(() => import("../features/readings/AddReading"));
const ReadingList = lazy(() => import("../features/readings/ReadingList"));
const PlotManagement = lazy(() => import("../features/plots/PlotManagement"));
const RoomDetail = lazy(() => import("../features/rooms/RoomDetail"));
const EditRoom = lazy(() => import("../features/rooms/EditRoom"));
const ReadingDetails = lazy(() => import("../features/readings/ReadingDetails"));
const RentCollectionList = lazy(() => import("../components/RentCollection/RentCollectionList"));

// Protected Route with Suspense
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </DashboardLayout>
  );
};

// Public Route with Suspense
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isAuthenticated) {
    return (
      <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />
    );
  }

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes - only accessible when not logged in */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes - only accessible when logged in */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/tenants">
        <Route
          index
          element={
            <ProtectedRoute>
              <TenantList />
            </ProtectedRoute>
          }
        />
        <Route
          path="add"
          element={
            <ProtectedRoute>
              <AddTenant />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id"
          element={
            <ProtectedRoute>
              <TenantDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute>
              <EditTenant />
            </ProtectedRoute>
          }
        />
      </Route>
      
      {/* Plot Routes */}
      <Route
        path="/plots"
        element={
          <ProtectedRoute>
            <PlotManagement />
          </ProtectedRoute>
        }
      />

      <Route path="/rooms">
        <Route
          index
          element={
            <ProtectedRoute>
              <RoomList />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id"
          element={
            <ProtectedRoute>
              <RoomDetail />
            </ProtectedRoute>
          }
        />  
        <Route
          path="add"
          element={
            <ProtectedRoute>
              <AddRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit/:id"
          element={
            <ProtectedRoute>
              <EditRoom />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/payments">
        <Route
          index
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/reports">
        <Route
          index
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/utilities">
        <Route
          index
          element={
            <ProtectedRoute>
              <UtilitiesPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/readings"
        element={
          <ProtectedRoute>
            <ReadingList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/readings/add"
        element={
          <ProtectedRoute>
            <AddReading />
          </ProtectedRoute>
        }
      />
      <Route
        path="/readings/:id"
        element={
          <ProtectedRoute>
            <ReadingDetails />
          </ProtectedRoute>
        }
      />
      <Route path="/rent-collection">
        <Route
          index
          element={
            <ProtectedRoute>
              <RentCollectionList />
            </ProtectedRoute>
          }
        />
      </Route>
      
      <Route path="/settings">
        <Route
          index
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Route */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <ProtectedRoute>
              <NotFound />
            </ProtectedRoute>
          ) : (
            <NotFound />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
