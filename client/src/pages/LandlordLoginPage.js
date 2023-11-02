import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import "./LoginPage.css";
import { useLandlordLogin } from "../hooks/useLogin";

const LandlordLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginError } = useLandlordLogin();
  const handleSignIn = async (e) => {
    await login(email, password);
    return;
  };

  return (
    <div className="login-container">
      <div className="block-container">
        <div className="login-left-container">
          <div>
            <div className="left-h1">
              <h1>
                <span className="first-letters">Rent</span>
                <span className="rest-letters">omatic.</span>
              </h1>
            </div>
            <h2 className="welcome">Welcome, Landlord!</h2>
            <div>
              <div className="field_container">
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field_container">
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                />
              </div>
              {loginError && <div align='center'><div className="loginError">{loginError}</div></div>}
              <div className="button_container">
                <Button variant="contained" onClick={handleSignIn}>
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="login-right-container">
          <img src="/rentomatic.png" alt="landingimg" className="image" />
          <h1 className="image-overlay">
            <span className="first-letters">Rent</span>
            <span className="last-letters">omatic.</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default LandlordLoginPage;
