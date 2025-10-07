import { Navigate } from "react-router-dom";

export const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("isAdmin");
  return token ? children : <Navigate to="/admin/login" />;
};
