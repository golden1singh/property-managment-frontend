import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../components/layout/DashboardLayout";

// Pages
import LoginPage from "../features/auth/LoginPage";
import LandingPage from "../features/landing/LandingPage";
import Dashboard from "../features/dashboard/Dashboard";
import PaymentPage from "../features/payments/PaymentPage";
import RoomList from "../features/rooms/RoomList";
import AddRoom from "../features/rooms/AddRoom";
import TenantList from "../features/tenants/TenantListB";
import AddTenant from "../features/tenants/AddTenant";
import EditTenant from "../features/tenants/EditTenant";
import TenantDetails from "../features/tenants/TenantDetails";
import ReportsPage from "../features/reports/ReportsPage";
import UtilitiesPage from "../features/utilities/UtilitiesPage";
import NotFound from "../components/common/NotFound";
import SettingsPage from "../features/settings/SettingsPage";
import AddReading from "../features/readings/AddReading";
import ReadingList from '../features/readings/ReadingList'
import PlotManagement from "../features/plots/PlotManagement";
import RoomDetail from '../features/rooms/RoomDetail'
import EditRoom from '../features/rooms/EditRoom'
import ReadingDetails from "../features/readings/ReadingDetails";
import RentCollectionList from "../components/RentCollection/RentCollectionList";
// import TenantDashboard from "../components/Dashboard/TenantDashboard";

// Protected Route - redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

// Public Route - redirects to dashboard if authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to the page they were trying to visit or dashboard
    return (
      <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />
    );
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log({isAuthenticated})

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
            {/* <TenantDashboard /> */}
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
