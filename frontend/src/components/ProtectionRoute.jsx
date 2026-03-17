import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "../context/UserContext";

const ProtectionRoute = ({ children }) => {

  const { token } = useContext(GlobalContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectionRoute;