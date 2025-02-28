import { Suspense } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../layout/DashboardLayout";
import LoadingSpinner from '../common/LoadingSpinner';

export const ProtectedRoute = ({ children }) => {
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

export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />;
  }

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}; 