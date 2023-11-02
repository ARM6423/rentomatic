import { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function TicketForm({ setSelectedTicket }) {
  const [validated, setValidated] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const username = "bob";
  const date = "23/11/2023";
  const idField = useRef();
  const opField = useRef();
  const categoryField = selectedOption;
  const titleField = useRef();
  const descriptionField = useRef();
  const imageField = useRef();
  const dateField = useRef();

  const handleClose = () => {
    setSelectedTicket((prev) => "");
  };

  useEffect(() => {
    idField.current.focus();
  }, []);

  const onSubmit = async (event) => {
    // event.preventDefault();
    // const data = await api.post("/users", {
    //   ID: idField.current.value,
    //   OP: opField.current.value,
    //   ticketStatus: statusField.current.value,
    //   category: categoryField
    //   description: descriptionField.current.value,
    //   image: imageField.current.value,
    //   datePosted: dateField.current.value,
    //   invoiceNeeded: invoiceField.current.value,
    // });
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    if (form.checkValidity === true) {
      setSelectedTicket((prev) => "");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h1 className="p-3 pb-0">Open a new ticket</h1>
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
              ref={opField}
              readOnly
              disabled
              placeholder={username}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="datePosted">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="text"
              disabled
              ref={dateField}
              readOnly
              placeholder={date}
            />
          </Form.Group>
        </Row>
        <Row className="g-3 mb-2">
          <Form.Group as={Col} controlId="ID">
            <Form.Label>Ticket ID</Form.Label>
            <Form.Control
              required
              type="text"
              ref={idField}
              placeholder="YYYY/MM/DD/ticketID"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid ticket ID.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select value={selectedOption} onChange={handleOptionChange}>
              <option value="Maintenance">Maintenance</option>
              <option value="Damage">Property Damage</option>
              <option value="Extension">Extension</option>
            </Form.Select>
          </Form.Group>
        </Row>
        <Form.Group controlId="title" className="g-3 mb-2">
          <Form.Label>Ticket Title</Form.Label>
          <Form.Control
            required
            type="text"
            ref={titleField}
            placeholder="Subject of Ticket"
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid ticket title.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="description" className="g-3 mb-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            required
            as="textarea"
            ref={descriptionField}
            rows={4}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a description.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="image" className="g-3 mb-2">
          <Form.Label>Attach Image</Form.Label>
          <Form.Control type="file" ref={imageField} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
