import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { ProtectedRoute, PublicRoute } from "./RouteGuards";
import * as Pages from "./lazyImports";
import PATHS from './paths';

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={PATHS.ROOT}
        element={
          <PublicRoute>
            <Pages.LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path={PATHS.LOGIN}
        element={
          <PublicRoute>
            <Pages.LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path={PATHS.DASHBOARD}
        element={
          <ProtectedRoute>
            <Pages.Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Tenant Routes */}
      <Route
        path={PATHS.TENANTS.LIST}
        element={
          <ProtectedRoute>
            <Pages.TenantList />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.TENANTS.ADD}
        element={
          <ProtectedRoute>
            <Pages.AddTenant />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.TENANTS.EDIT}
        element={
          <ProtectedRoute>
            <Pages.EditTenant />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.TENANTS.DETAILS}
        element={
          <ProtectedRoute>
            <Pages.TenantDetails />
          </ProtectedRoute>
        }
      />

      {/* Room Routes */}
      <Route
        path={PATHS.ROOMS.LIST}
        element={
          <ProtectedRoute>
            <Pages.RoomList />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ROOMS.ADD}
        element={
          <ProtectedRoute>
            <Pages.AddRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ROOMS.EDIT}
        element={
          <ProtectedRoute>
            <Pages.EditRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ROOMS.DETAILS}
        element={
          <ProtectedRoute>
            <Pages.RoomDetail />
          </ProtectedRoute>
        }
      />

      {/* Other Routes */}
      <Route
        path={PATHS.PAYMENTS}
        element={
          <ProtectedRoute>
            <Pages.PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.REPORTS}
        element={
          <ProtectedRoute>
            <Pages.ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.UTILITIES}
        element={
          <ProtectedRoute>
            <Pages.UtilitiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.PLOTS}
        element={
          <ProtectedRoute>
            <Pages.PlotManagement />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path={PATHS.SETTINGS}
        element={
          <ProtectedRoute>
            <Pages.SettingsPage />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path={PATHS.RENT_COLLECTION}
        element={
          <ProtectedRoute>
            <Pages.RentCollectionList />
          </ProtectedRoute>
        }
      />

      {/* Reading Routes */}
      <Route
        path={PATHS.READINGS.LIST}
        element={
          <ProtectedRoute>
            <Pages.ReadingList />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.READINGS.ADD}
        element={
          <ProtectedRoute>
            <Pages.AddReading />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.READINGS.DETAILS}
        element={
          <ProtectedRoute>
            <Pages.ReadingDetails />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route
        path={PATHS.NOT_FOUND}
        element={
          isAuthenticated ? (
            <ProtectedRoute>
              <Pages.NotFound />
            </ProtectedRoute>
          ) : (
            <Pages.NotFound />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
