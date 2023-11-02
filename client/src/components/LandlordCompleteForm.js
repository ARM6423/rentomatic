import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

export default function LandlordCompleteForm({ selectedTicket }) {
  const date = moment(selectedTicket.datePosted).format("DD/MM/YYYY");
  const [tenantData, setTenantData] = useState(null);
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

  return (
    <div>
      <h1 className="p-3 pb-0">Ticket resolved</h1>
      <Form noValidate className="p-3">
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

        {selectedTicket.invoiceNeeded === true ? (
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
        ) : (
          ""
        )}
        <Form.Check
          type="checkbox"
          label="The landlord has verified that the issue has been resolved and closed the ticket."
          disabled
          readOnly
          checked
        />
        {selectedTicket.feedbackGiven === true ? (
          <>
            <p className="tenant_feedback">Tenant Feedback:</p>
            <Typography component="legend">Rate our Services</Typography>
            <Rating
              name="rating"
              value={selectedTicket.feedbackRating}
              disabled
            />
            <Form.Group className="mb-3" controlId="feedbackField">
              <Form.Label>
                Any thoughts or concerns you'd like to share?
              </Form.Label>
              <Form.Control
                placeholder={selectedTicket.feedbackDesc}
                disabled
                type="text"
                rows={3}
                name="comments"
              />
            </Form.Group>
          </>
        ) : (
          <></>
        )}
      </Form>
    </div>
  );
}
