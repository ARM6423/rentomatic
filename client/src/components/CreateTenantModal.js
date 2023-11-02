import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "../index.css";

function CreateTenantModal({
  show,
  handleClose,
  signup,
  signupisLoading,
  signupError,
  propertiesOwned,
  setNewEntry,
}) {
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    propertyid: "",
  });

  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
    if (key === "propertyid" && value === "Choose one...") {
      setFormError("Please select a property.");
    } else {
      setFormError(null);
    }
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      await signup(formData.email, formData.password, formData.propertyid);
      if (!signupError) {
        setNewEntry((prev) => prev + 1);
        setValidated(true);
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Tenant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="propertyField" className="mb-3">
              <Form.Label>Property</Form.Label>
              <Form.Select
                required
                onChange={handleChange}
                name="propertyid"
                value={formData.propertyid}
              >
                <option disabled value="">
                  Choose one...
                </option>
                {Array.isArray(propertiesOwned) ? (
                  propertiesOwned.map((property) => {
                    return (
                      <option key={property.name} value={property._id}>
                        {property.name}
                      </option>
                    );
                  })
                ) : (
                  <></>
                )}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a property
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="emailField">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
                required
                autoComplete="off"
                onChange={handleChange}
                name="email"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="passwordField">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                placeholder="Enter a strong password"
                autoComplete="new-password"
                onChange={handleChange}
                name="password"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid password.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        {signupError === null && signupisLoading === null ? (
          <></>
        ) : signupError && signupisLoading === false ? (
          <div className="tenantSignUpError">{signupError}</div>
        ) : signupError === null && signupisLoading === false ? (
          <div className="tenantSignUpSuccess">
            New tenant successfully created!
          </div>
        ) : (
          <>Error!</>
        )}
        <Modal.Footer>
          <Button data-cy="close" variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit} type="submit">
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateTenantModal;
