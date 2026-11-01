import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserState } from "../store/UserSlice";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getUserInTheSession } from "./SessionStorage";

// This component checks if the user is authenticated or not
// If yes, then renders the protected child routes via Outlet
// Else, navigates them to the login page
const ProtectedRoutes = () => {
  const sessionUser = getUserInTheSession();
  const userState: UserState = useSelector(
    (state: RootState) => state.user as UserState
  );
  const isAuthenticated = Boolean(sessionUser || userState?.loginResponse?.user);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
