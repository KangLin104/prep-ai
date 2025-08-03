import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();
    console.log("ProtectedRoute user:", user);
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
