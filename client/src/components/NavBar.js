import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../pages/LandlordPage.css";
import useLogout from "../hooks/useLogout";

export default function NavBar({ setToken, tab, parent }) {
  const [selectedTab, setSelectedTab] = useState(tab);
  const navigate = useNavigate();
  const { logout } = useLogout();

  const handleSignOut = async () => {
    // redirect to login page
    logout();
    setToken(false);
    return;
  };

  const handleTabClick = (tabName) => {
    if (selectedTab !== tabName) {
      setSelectedTab(tabName);
      if (tabName === "Dashboard") {
        // redirect to dashboard
        if (parent === "landlord") {
          navigate("/landlord"); // hide settings page
        } else if (parent === "tenant") {
          navigate("/tenant"); // hide settings page
        }
        return;
        // check if current route is landlord page
      } else if (tabName === "Settings") {
        if (parent === "landlord") {
          navigate("/landlord/settings"); // show settings page
        } else if (parent === "tenant") {
          navigate("/tenant/settings"); // show settings page
        }
        return;
      }
    }
  };

  return (
    <div className="taskbar">
      <div className="taskbar-center-container">
        <Button
          variant={
            selectedTab === "Dashboard"
              ? "taskbar button selected"
              : "taskbar button"
          }
          onClick={() => handleTabClick("Dashboard")}
        >
          Dashboard
        </Button>
        {parent === "landlord" ? (
          <Button
            variant={
              selectedTab === "Settings"
                ? "taskbar button selected"
                : "taskbar button"
            }
            onClick={() => handleTabClick("Settings")}
          >
            Settings
          </Button>
        ) : (
          <></>
        )}
      </div>
      <div className="taskbar-right-container">
        <Button variant="taskbar button" onClick={() => handleSignOut()}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
