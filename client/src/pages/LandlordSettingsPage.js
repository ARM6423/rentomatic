import React from "react";
import { Button } from "react-bootstrap";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import "../index.css";
import { useTenantSignup } from "../hooks/useSignup";
import CreateTenantModal from "../components/CreateTenantModal";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import useTable from "../hooks/useTable";
import Pagination from "../components/Pagination";

const LandlordSettingsPage = ({ setToken, handleTabClick }) => {
  const [numberOfTenants, setNumberOfTenants] = useState(0);
  const [numberOfProperties, setNumberOfProperties] = useState(0);
  const [show, setShow] = useState(false);
  const [propertiesOwned, setPropertiesOwned] = useState([]);
  const userToken = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(userToken);
  const { signup, signupisLoading, signupError, setError, setIsLoading } =
    useTenantSignup();
  const [newEntry, setNewEntry] = useState(null);
  const [leftList, setLeftList] = useState([]);
  
  //TRANSFORM NESTED OBJECT DATA TO FLAT LEFT LIST TO USE
  function transformList(data) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        result.push(data[i][j]);
      }
    }
    return result;
  }
  //FETCH DATA AND UPDATE LEFT AND RIGHT LIST DATA, AS WELL AS NUMBER OF TENANTS/PROPERTY
  //TODO:ADD RE-RENDER ON ADD TENANT/PROPERTY
  useEffect(() => {
    const fetchLandlordData = async () => {
      await axios
        .get("http://localhost:5050/api/landlord/" + user.id)
        .then((res) => {
          setPropertiesOwned(res.data.PropertiesOwned);
          setNumberOfProperties(res.data.PropertiesOwned.length);
          let total = 0;
          for (const i in res.data.PropertiesOwned) {
            for (const j in res.data.PropertiesOwned[i]) {
              if (j === "tenants") {
                total += res.data.PropertiesOwned[i][j].length;
              }
            }
          }
          setNumberOfTenants(total);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchLandlordData();
    setNewEntry(0);
  }, [user.id, newEntry]);

  useEffect(() => {
    const leftData = propertiesOwned.map((property) => {
      return property.tenants.map((tenant) => {
        return { property: property.name, email: tenant.email };
      });
    });
    setLeftList(transformList(leftData));
  }, [propertiesOwned]);

  //TABLE PAGINATION
  const rightRowsPerPage = 5;
  const [rightPage, setRightPage] = useState(1);
  const { slice: rightSlice, range: rightRange } = useTable(
    propertiesOwned,
    rightPage,
    rightRowsPerPage
  );
  const leftRowsPerPage = 9;
  const [leftPage, setLeftPage] = useState(1);
  const { slice: leftSlice, range: leftRange } = useTable(
    leftList,
    leftPage,
    leftRowsPerPage
  );
  //FOR SIGN UP TENANT
  const [propertyData, setPropertyData] = useState(
    {
      id: user.id,
      propertyName: "",
    },
    [user]
  );
  //CLOSE AND OPEN MODAL FOR SIGN UP TENANT
  const handleClose = () => {
    setShow(false);
    setError(null);
    setIsLoading(null);
  };
  const handleShow = () => {
    setShow(true);
  };

  // HANDLE ADD NEW PROPERTY OF LANDLORD
  const handleAddProperty = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5050/api/landlord/property/create", propertyData)
      .then((res) => {
        console.log(res.status, res.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
      });
    setPropertyData({ ...propertyData, propertyName: "" });
    setNewEntry(newEntry + 1);
  };
  //HANDLE FORM INPUT CHANGE
  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.value;
    setPropertyData({ ...propertyData, [key]: value });
  }

  return (
    <div>
      <Header />
      <NavBar setToken={setToken} tab="Settings" parent="landlord"></NavBar>
      <div className="body settings">
        <div className="settings-left-container">
          <Card variant="outlined" sx={{ p: "0.75rem" }}>
            <h3>{numberOfTenants} Tenants</h3>
            <Button variant="outline-dark" onClick={handleShow}>
              New tenant...
            </Button>
            <CreateTenantModal
              show={show}
              handleClose={handleClose}
              signup={signup}
              signupisLoading={signupisLoading}
              signupError={signupError}
              propertiesOwned={propertiesOwned}
              setNewEntry={setNewEntry}
            />
            <TableContainer sx={{ mt: "0.75rem" }} component={Paper}>
              <Table aria-label="tenant table">
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Tenant ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leftSlice.map((tenant) => {
                    return (
                      <TableRow key={tenant.email}>
                        <TableCell>{tenant.property}</TableCell>
                        <TableCell>{tenant.email}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Pagination
                range={leftRange}
                slice={leftSlice}
                setPage={setLeftPage}
                page={leftPage}
              />
            </TableContainer>
          </Card>
        </div>

        <div className="settings-right-container">
          <Card variant="outlined" sx={{ p: "0.75rem" }}>
            <h3>{numberOfProperties} Properties</h3>
            <InputGroup>
              <Button
                variant="outline-dark"
                onClick={handleAddProperty}
                type="submit"
              >
                Add property
              </Button>
              <Form.Control
                aria-label="property input field"
                aria-describedby="property input"
                placeholder="Property name..."
                name="propertyName"
                onChange={handleChange}
                value={propertyData.propertyName}
              />
            </InputGroup>
            <TableContainer sx={{ mt: "0.75rem" }} component={Paper}>
              <Table aria-label="property table">
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Number of Tenants</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rightSlice.map((row) => {
                    return (
                      <TableRow key={row._id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.tenants.length}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Pagination
                range={rightRange}
                slice={rightSlice}
                setPage={setRightPage}
                page={rightPage}
              />
            </TableContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* 
TODOS:
- CSS styling
- Sizing
- Addition of more functionality
- Transitions if possible
*/

export default LandlordSettingsPage;
