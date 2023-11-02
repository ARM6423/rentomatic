import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FileIcon, defaultStyles } from "react-file-icon";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

export default function LandlordProgressForm({
  selectedTicket,
  setSelectedTicket,
  setAllTickets,
}) {
  const [validated, setValidated] = useState(false);
  const [tenantData, setTenantData] = useState(null);
  const date = moment(selectedTicket.datePosted).format("DD/MM/YYYY");
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

  const onSubmit = async (event) => {
    //TODO: change status to complete and re-render ticket list.
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      axios
        .patch(
          "http://localhost:5050/api/landlord/completeTicket/" +
            selectedTicket._id,
            null,config
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
      event.target.reset();
      //Condition to re-render ticket list
      setSelectedTicket("");
    }
    setValidated(true);
  };
  console.log(selectedTicket.invoiceNeeded);

  return (
    <div>
      <h1 className="p-3 pb-0">Ticket in-progress</h1>
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
        <Row>
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
        </Row>
        {selectedTicket.invoiceNeeded === true &&
        selectedTicket.acceptanceByTenant === false ? (
          // ticket needs invoice and tenant has not accepted invoice
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
            <div style={{ color: "red" }}>
              The tenant has not accepted the invoice yet.
            </div>
          </div>
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
              label="Invoice has been accepted by tenant."
              disabled
              checked
            />
            <Form.Group as={Col} className="g-3 mb-2">
              <br />
              <Button variant="primary" type="submit">
                Complete
              </Button>
            </Form.Group>
          </>
        ) : (
          <Form.Group as={Col} className="g-3 mb-2">
            <br />
            <Button variant="primary" type="submit">
              Complete
            </Button>
          </Form.Group>
        )}
      </Form>
    </div>
  );
}
