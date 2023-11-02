import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FileIcon, defaultStyles } from "react-file-icon";
import { CloseButton } from "react-bootstrap";
import axios from "axios";
import moment from "moment";

export default function TenantProgressForm({
  setSelectedTicket,
  selectedTicket,
  tenantID,
  setListTickets,
}) {
  const [validated, setValidated] = useState(false);
  const [ticket, setTicket] = useState(null);
  const date = moment(selectedTicket.datePosted).format("DD/MM/YYYY");
  const userToken = JSON.parse(localStorage.getItem('user'));
  const config = {
    'headers':{'authorization': `Bearer ${userToken.token}`}
  }

  const handleClose = () => {
    setSelectedTicket((prev) => "");
  };

  useEffect(() => {
    setTicket(selectedTicket);
  }, [selectedTicket]);

  const onSubmit = async (event) => {
    //TODO: change tenantAccepted value, change status to complete and re-render ticket list.
    //TODO: Implement proper PDF and Image functions
    
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      axios
        .patch("http://localhost:5050/api/tenant/acceptInvoice/" + ticket._id,null,config)
        .then((res) => {
          setListTickets((rows) =>
            rows.map((r) => (r._id === res.data._id ? res.data : r))
          );
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
      event.target.reset();
      //Condition to re-render ticket list
      setSelectedTicket("");
    }
    setValidated(true);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottom: "0.5px solid black",
          margin: "1rem",
        }}
      >
        <h1 className="pb-1">Ticket In-Progress</h1>
        <CloseButton className="p-3 " onClick={handleClose} />
      </div>
      <Form
        noValidate
        validated={validated}
        onSubmit={onSubmit}
        className="p-3"
      >
        <Row className="g-3 mb-2">
          <Form.Group as={Col} controlId="OP">
            <Form.Label>Tenant ID</Form.Label>
            <Form.Control
              type="text"
              readOnly
              disabled
              placeholder={tenantID}
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
        {selectedTicket.invoiceNeeded === true &&
        selectedTicket.acceptanceByTenant === false ? (
          <>
            <div className="invoice">
              Attached invoice:
              <Button variant="link">
                <a
                  href={`http://localhost:5050/uploads/${selectedTicket.invoiceImage}`}
                  without
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="invoiceIcon">
                    <FileIcon extension="pdf" {...defaultStyles.pdf} />
                    Download
                  </div>
                </a>
              </Button>
            </div>
            <div className="TandC">
              <Form.Check
                type="checkbox"
                label="I agree to the terms and conditions."
                required
                feedback="You must agree before submitting."
                feedbackType="invalid"
              />
              <Button variant="primary" type="submit">
                Accept
              </Button>
            </div>
          </>
        ) : selectedTicket.invoiceNeeded === true &&
          selectedTicket.acceptanceByTenant === true ? (
          <>
            <div className="invoice">
              Attached invoice:
              <Button variant="link">
                <a
                  href={`http://localhost:5050/uploads/${selectedTicket.invoiceImage}`}
                  without
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="invoiceIcon">
                    <FileIcon extension="pdf" {...defaultStyles.pdf} />
                    Download
                  </div>
                </a>
              </Button>
            </div>

            <Form.Check
              type="checkbox"
              label="You have accepted the invoice and the issue is being actively worked on."
              disabled
              checked
            />
          </>
        ) : (
          <div style={{ color: "green" }}>
            The landlord is currently processing your request.
          </div>
        )}
      </Form>
    </div>
  );
}
