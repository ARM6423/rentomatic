import React from "react";
import { Button } from "react-bootstrap";
import Header from "../components/Header";
import NavBar from "../components/NavBar";

const TenantSettingsPage = ({ setToken }) => {
  return (
    <div>
      <Header />
      <NavBar setToken={setToken} tab="Settings" parent="tenant"></NavBar>
      <h2>Settings Page</h2>
      <br />
      <div>
        <h3>Settings Group 1</h3>
        <p>Settings Group Description 1</p>
        <Button
          variant="primary"
          onClick={() => {
            return;
          }}
        >
          Example button
        </Button>
        <br />
        {/* settings content is hardcoded for the time being but you get the general idea */}
      </div>
    </div>
  );
};

/* 

...yeah this will have to be heavily modified for the purposes but I 
just wanted to make this an actual component at the bare minimum.

TODOS:
- CSS styling
- Sizing
- Addition of more functionality
- Transitions if possible

*/

export default TenantSettingsPage;
