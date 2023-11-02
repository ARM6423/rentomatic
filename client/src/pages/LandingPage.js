import background from "../assets/landingBG.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function LandingPage() {
  const navigate = useNavigate();
  const handleLandlordLogin = () => {
    navigate("/landlordlogin");
  };
  const handleTenantLogin = () => {
    navigate("/tenantlogin");
  };

  const styles = {
    header: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "40vh",
      backgroundImage: `url(${background})`, // Set the path to your image
      backgroundSize: "cover",
      backgroundPosition: "center",
      boxShadow: "inset 0 0 0 500px rgba(0,0,0,0.3)",
    },
    title: {
      fontSize: "64px",
      margin: "0",
      width: "fitContent",
    },
    orangeTitle: {
      color: "#FF5F1F",
      fontWeight: "bold",
      margin: "0",
    },
    whiteTitle: {
      color: "white",
      fontWeight: "bold",
      margin: "0",
    },
    titleText: {
      color: "white",
      fontWeight: "bold",
      fontSize: "18px",
      width: "inherit",
    },
    body: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "300px", // Set your desired width here
      margin: "auto", // Centers the container horizontally
      height: "40vh",
    },
    bodyText: {
      display: "flex",
      padding: "16px 16px",
      borderLeft: "2px solid black",
    },
    button: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    buttongroup: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      gap: "1rem",
    },
  };

  return (
    <div>
      <div style={styles.header}>
        <div style={styles.title}>
          <span style={styles.orangeTitle}>RENT</span>
          <span style={styles.whiteTitle}>OMATIC.</span>
        </div>
        <div style={styles.titleText}>Property Management</div>
        <div style={styles.titleText}>Simplified.</div>
        <div></div>
      </div>
      <div style={styles.body}>
        <div style={styles.bodyText}>
          Elevate your property management with our all-in-one platform.
        </div>
        <div style={styles.bodyText}>
          Start streamlining communication and foster friendlier tenant-landlord
          relationships today.
        </div>
      </div>
      <div style={styles.buttongroup}>
        <div style={styles.button}>
          <Button variant="contained" onClick={handleLandlordLogin}>
            Landlord login
          </Button>
        </div>
        <div style={styles.button}>
          <Button variant="contained" onClick={handleTenantLogin}>
            Tenant login
          </Button>
        </div>
      </div>
    </div>
  );
}
