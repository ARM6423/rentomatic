import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

export default function LandlordPendingForm({
  selectedTicket,
  setAllTickets,
  setSelectedTicket,
}) {
  const [tenantData, setTenantData] = useState(null);
  const date = moment(selectedTicket.datePosted).format("DD/MM/YYYY");
  const [invoiceChecked, setInvoiceChecked] = useState(false);
  const [invoice, setInvoice] = useState({ invoiceImage: null });
  const [validated, setValidated] = useState(false);
  const userToken = JSON.parse(localStorage.getItem('user'));
  const config = {
    'headers':{'authorization': `Bearer ${userToken.token}`}
  }
  useEffect(() => {
    axios
      .get("http://localhost:5050/api/tenant/" + selectedTicket.OP,config)
      .then((res) => {
        setTenantData(res.data);
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
  }, [selectedTicket.OP]);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (invoiceChecked) {
        axios({
          method: "patch",
          url:
            "http://localhost:5050/api/landlord/submitInvoice/" +
            selectedTicket._id,
          data: invoice,
          headers: {
            "content-type": "multipart/form-data",
            "authorization":`Bearer ${userToken.token}`
          },
        })
          .then((res) => {
            setAllTickets((rows) =>
              rows.map((r) => (r._id === res.data._id ? res.data : r))
            );
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
      } else {
        axios
          .patch(
            "http://localhost:5050/api/landlord/noInvoice/" + selectedTicket._id,null,config
          )
          .then((res) => {
            setAllTickets((rows) =>
              rows.map((r) => (r._id === res.data._id ? res.data : r))
            );
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
      }

      event.target.reset();
      //Condition to re-render ticket list
      setSelectedTicket("");
    }
    setValidated(true);
  };

  const handleChange = (e) => {
    setInvoiceChecked((current) => !current);
  };

  return (
    <div>
      <h1 className="p-3 pb-0">Pending Ticket</h1>
      <Form
        noValidate
        className="p-3"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <Row className="g-3 mb-2">
          <Form.Group as={Col} controlId="OP">
            <Form.Label>Tenant ID</Form.Label>
            <Form.Control
              type="text"
              readOnly
              disabled
              placeholder={tenantData?.email}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="datePosted">
            <Form.Label>Date</Form.Label>
            <Form.Control type="text" disabled readOnly placeholder={date} />
          </Form.Group>
        </Row>
        <Row className="g-3 mb-2">
          <Form.Group as={Col} controlId="ID">
            <Form.Label>Ticket ID</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder={selectedTicket.ID}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder={selectedTicket.category}
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="title" className="g-3 mb-2">
          <Form.Label>Ticket Title</Form.Label>
          <Form.Control
            type="text"
            disabled
            placeholder={selectedTicket.Title}
          />
        </Form.Group>
        <Form.Group controlId="title" className="g-3 mb-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            disabled
            as="textarea"
            rows={4}
            value={selectedTicket.description}
          />
        </Form.Group>
        {selectedTicket.image && (
          <img
            className="ticketImage"
            src={`http://localhost:5050/${selectedTicket.image}`}
            alt="issue"
          ></img>
        )}
        <Form.Group controlId="invoice" className="g-3 mb-2">
          <Form.Label>Attach Invoice</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              setInvoice({ ...invoice, invoiceImage: e.target.files[0] });
            }}
          />
        </Form.Group>
        <Form.Check
          type="checkbox"
          label="Check this if the tenant requires an invoice and it is uploaded."
          onChange={handleChange}
        />
        <Row>
          <Form.Group
            as={Col}
            controlId="acceptanceByLandlord"
            className="g-3 mb-1"
          >
            <Button variant="primary" type="submit" className="me-2">
              Accept
            </Button>
          </Form.Group>
        </Row>
      </Form>
    </div>
  );
}
