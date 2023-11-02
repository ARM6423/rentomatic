import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import axios from "axios";
import "../pages/LandlordPage.css";
import "../index.css";

export default function TenantTicketForm({
  setSelectedTicket,
  tenantID,
  email,
  setListTickets,
}) {
  const [validated, setValidated] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);
  const [id, setID] = useState(null);
  const userToken = JSON.parse(localStorage.getItem('user'));
  const config = {
    headers: { Authorization: `Bearer ${userToken.token}` }
  };

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        timeZone: "Asia/Singapore",
      })
    );
    //API CALL GET USER ID & Current number of tickets for the day
    axios
      .get("http://localhost:5050/api/tenant/tickets/setID",config)
      .then((res) => {
        setID(res.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log("server responded useeffect");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
      });
  }, []);

  useEffect(() => {
    setFormData({ ...formData, ID: id });
  }, [id]);

  const [formData, setFormData] = useState({
    Title: "",
    ID: id,
    OP: tenantID,
    ticketStatus: "Pending",
    category: "Maintenance",
    description: "",
    image: null,
    datePosted: currentDate,
    invoiceNeeded: null,
    acceptanceByTenant: null,
    invoiceImage: null,
  });

  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  }

  const handleClose = () => {
    setSelectedTicket((prev) => "");
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      axios({
        method: "post",
        url: "http://localhost:5050/api/tenant/createticket",
        data: formData,
        headers: {
          "content-type": "multipart/form-data",
          "authorization": `Bearer ${userToken.token}`
        },
      })
        .then((res) => {
          setListTickets((prev) => [res.data, ...prev]);
          console.log(res.status, res.data);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log("server responded submit form");
          } else if (error.request) {
            console.log("network error");
          } else {
            console.log(error);
          }
        });

      event.target.reset();
      //Condition to re-render ticket list
      setSelectedTicket("");
    }
    setValidated(true);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottom: "0.5px solid black",
          margin: "1rem",
        }}
      >
        <h1 className="pb-1">Open a new ticket</h1>
        <CloseButton className="p-3 " onClick={handleClose} />
      </div>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="p-3 pt-0"
        encType="multipart/form-data"
      >
        <Row className="g-3 mb-2">
          <Form.Group as={Col} controlId="OP">
            <Form.Label>Tenant ID</Form.Label>
            <Form.Control
              type="text"
              readOnly
              disabled
              name="OP"
              placeholder={email}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="datePosted">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="text"
              disabled
              name="datePosted"
              readOnly
              placeholder={currentDate}
            />
          </Form.Group>
        </Row>
        <Row className="g-3 mb-2">
          <Form.Group as={Col} controlId="ID">
            <Form.Label>Ticket ID</Form.Label>
            <Form.Control disabled name="id" type="text" placeholder={id} />
            <Form.Control.Feedback type="invalid">
              Please provide a valid ticket ID.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select onChange={handleChange} name="category">
              <option value="Maintenance">Maintenance</option>
              <option value="Property Damage">Property Damage</option>
              <option value="Extension">Extension</option>
            </Form.Select>
          </Form.Group>
        </Row>
        <Form.Group controlId="title" className="g-3 mb-2">
          <Form.Label>Ticket Title</Form.Label>
          <Form.Control
            autoFocus
            required
            type="text"
            name="Title"
            onChange={handleChange}
            placeholder="Subject of Ticket"
          />
          <Form.Control.Feedback data-cy="invalid_title" type="invalid">
            Please provide a valid ticket title.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="description" className="g-3 mb-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            required
            as="textarea"
            name="description"
            onChange={handleChange}
            rows={4}
          />
          <Form.Control.Feedback data-cy="invalid_desc" type="invalid">
            Please provide a description.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="image" className="g-3 mb-2">
          <Form.Label>Attach Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              setFormData({ ...formData, image: e.target.files[0] });
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}
