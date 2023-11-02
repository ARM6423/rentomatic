import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import CloseButton from "react-bootstrap/CloseButton";
import moment from "moment";

export default function TenantPendingForm({
  setSelectedTicket,
  selectedTicket,
  tenantID,
}) {
  const date = moment(selectedTicket.datePosted).format("DD/MM/YYYY");

  const handleClose = () => {
    setSelectedTicket((prev) => "");
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
        <h1 className="pb-1">Pending ticket</h1>
        <CloseButton className="p-3 " onClick={handleClose} />
      </div>
      <Form noValidate className="p-3">
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
      </Form>
    </div>
  );
}
