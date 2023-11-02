import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import axios from "axios";

export default function FeedbackForm({
  ID,
  show,
  handleClose,
  setListTickets,
  selectedTicket,
  setSelectedTicket,
}) {
  // submit or cancel button triggers closeModal callback function
  // more functionality can be added
  const [feedback, setFeedback] = useState({
    ID: ID,
    rating: 3,
    comments: "",
  });

  const [validated, setValidated] = useState(false);
  const userToken = JSON.parse(localStorage.getItem('user'));

  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.value;
    setFeedback({ ...feedback, [key]: value });
  }

  useEffect(() => {
    setFeedback((prevFeedback) => ({ ...prevFeedback, ID: ID }));
  }, [ID]);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    const config = {
      'headers':{'authorization': `Bearer ${userToken.token}`}
    }
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      //TODO: API TO UPDATE FEEDBACK UNDER TICKETS

      try {
        const res = await axios.patch(
          "http://localhost:5050/api/tenant/submitFeedback",
          feedback,
          config
        );
        console.log(res.data);
        setSelectedTicket(res.data);
        setListTickets((rows) =>
          rows.map((r) => (r._id === res.data._id ? res.data : r))
        );
      } catch (error) {
        console.error(error);
      }
    }
    setValidated(true);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Typography component="legend">Rate our Services</Typography>
          <Rating
            name="rating"
            value={feedback.rating}
            disabled={selectedTicket.feedbackGiven}
            onChange={(event, newValue) => {
              setFeedback({ ...feedback, rating: newValue });
            }}
          />
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="feedbackField">
              <Form.Label>
                Any thoughts or concerns you'd like to share?
              </Form.Label>
              <Form.Control
                placeholder="Briefly describe your experience with us"
                autoFocus
                required
                autoComplete="off"
                as="textarea"
                rows={3}
                onChange={handleChange}
                name="comments"
                disabled={selectedTicket.feedbackGiven}
              />
              <Form.Control.Feedback type="invalid">
                Please provide your feedback
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
          {selectedTicket.feedbackGiven && (
            <p style={{ color: "green" }}>
              You have successfully submitted your feedback!
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} date-cy="close">
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            type="submit"
            disabled={selectedTicket.feedbackGiven}
            data-cy="submit"
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
