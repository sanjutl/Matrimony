import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useSelector((state) => state.user);


  const parsedRole = parseInt(role);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(parsedRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
