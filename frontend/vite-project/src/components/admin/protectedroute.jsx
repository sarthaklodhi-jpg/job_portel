import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireCompleteProfile = true,
}) => {
  const { user } = useSelector((store) => store.auth);

  if (!user) return <Navigate to="/login" replace />;

  if (requireCompleteProfile && !user.isProfileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "recruiter" ? "/admin/companies" : "/jobs"} replace />;
  }

  return children;
};

export default ProtectedRoute;
