import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LandlordLoginPage from "./pages/LandlordLoginPage";
import React, { useEffect, useState } from "react";
import LandlordPage from "./pages/LandlordPage";
import TenantPage from "./pages/TenantPage";
import { createTheme, ThemeProvider } from "@mui/material";
import LandlordSettingsPage from "./pages/LandlordSettingsPage";
import TenantLoginPage from "./pages/TenantLoginPage";
import TenantSettingsPage from "./pages/TenantSettingsPage";
import { useAuthContext } from "./hooks/useAuthContext";
import Spinner from "react-bootstrap/Spinner";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff5f1f",
    },
  },
});

function App() {
  const { user } = useAuthContext();
  const initializeState = () => !!JSON.parse(localStorage.getItem("user"));
  const [token, setToken] = useState(initializeState);
  var role = null;
  if (user != null) {
    role = user.role;
  }
  useEffect(() => {
    document.title = "Rentomatic";
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route
              path="/landlordlogin"
              element={
                !user ? <LandlordLoginPage /> : <Navigate to="/landlord" />
              }
            />
            <Route
              path="/landlord"
              element={
                user && role === "LANDLORD" ? (
                  <LandlordPage setToken={setToken} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/landlord/settings"
              element={
                token && user === null ? (
                  <Spinner animation="border" />
                ) : user && role === "LANDLORD" ? (
                  <LandlordSettingsPage setToken={setToken} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/tenantlogin"
              element={!user ? <TenantLoginPage /> : <Navigate to="/tenant" />}
            />
            <Route
              path="/tenant"
              element={
                user && role === "TENANT" ? (
                  <TenantPage setToken={setToken} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/tenant/settings"
              element={
                token && user === null ? (
                  <Spinner animation="border" />
                ) : user && role === "TENANT" ? (
                  <TenantSettingsPage setToken={setToken} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/"
              element={
                token && user === null ? (
                  <LandingPage />
                ) : user && role === "LANDLORD" ? (
                  <Navigate to="/landlord" />
                ) : user && role === "TENANT" ? (
                  <Navigate to="/tenant" />
                ) : (
                  <LandingPage />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;

//TODO: RESTRICTED ROUTES, REPLACE AFTER DEVELOPMENT FOR PROPER AUTHENTICATED ROUTING
{
  /* <Route
  path="/landlord"
  element={
    user && role === "LANDLORD" ? (
      <LandlordPage />
    ) : (
      <Navigate to="/" />
    )
  }
/>
<Route
  path="/landlord/settings"
  element={
    user && role === "LANDLORD" ? (
      <LandlordSettingsPage />
    ) : (
      <Navigate to="/" />
    )
  }
/>
<Route
  path="/tenantlogin"
  element={!user ? <TenantLoginPage /> : <Navigate to="/tenant" />}
/>
<Route
  path="/tenant"
  element={
    user && role === "TENANT" ? <TenantPage /> : <Navigate to="/" />
  }
/>
<Route
  path="/tenant/settings"
  element={
    user && role === "TENANT" ? (
      <TenantSettingsPage />
    ) : (
      <Navigate to="/" />
    )
  }
/> */
}

// <Routes>
//   <Route path="/landlordlogin" element={<LandlordLoginPage />} />
//   <Route path="/landlord" element={<LandlordPage />} />
//   <Route
//     path="/landlord/settings"
//     element={<LandlordSettingsPage />}
//   />
//   <Route path="/tenantlogin" element={<TenantLoginPage />} />
//   <Route path="/tenant" element={<TenantPage />} />
//   <Route path="/tenant/settings" element={<TenantSettingsPage />} />
//   <Route path="/" element={<LandingPage />} />
//   <Route path="*" element={<Navigate to="/" />} />
// </Routes>
