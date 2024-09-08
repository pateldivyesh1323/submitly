import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  if (!isAuthenticated && !isAuthLoading) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;
