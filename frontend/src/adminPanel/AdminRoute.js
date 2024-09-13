import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Import the AuthContext

const AdminRoute = ({ element, ...rest }) => {
  const { user } = useContext(AuthContext);

  if (user?.email === "andelif33@gmail.com") {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;