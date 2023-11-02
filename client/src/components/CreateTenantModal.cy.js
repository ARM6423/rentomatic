import React, { useState } from "react";
import CreateTenantModal from "./CreateTenantModal";
// run npx cypress open

describe("Landlord creates Tenant", () => {
  const propertiesOwnedStub = [
    { _id: 1, name: "Property 1" },
    { _id: 2, name: "Property 2" },
    { _id: 3, name: "Property 3" },
    // Add more properties as needed
  ];

  let handleCloseStub;
  let signupStub;
  let setNewEntryStub;

  function ParentComponentValid() {
    let [show, setShow] = useState(true);
    let [signupisLoading, setSignupIsLoading] = useState(null);
    let [signupError, setSignupError] = useState(null);

    signupStub = cy.stub().callsFake(() => {
      setSignupIsLoading(false);
      setSignupError(null);
    });
    handleCloseStub = cy.stub().callsFake(() => setShow(false));
    setNewEntryStub = cy.stub().resolves();

    return (
      <CreateTenantModal
        show={show}
        handleClose={handleCloseStub}
        signup={signupStub}
        signupisLoading={signupisLoading}
        signupError={signupError}
        propertiesOwned={propertiesOwnedStub}
        setNewEntry={setNewEntryStub}
      />
    );
  }

  function ParentComponentInvalid() {
    let [show, setShow] = useState(true);
    let [signupisLoading, setSignupIsLoading] = useState(null);
    let [signupError, setSignupError] = useState(null);

    handleCloseStub = cy.stub().callsFake(() => setShow(false));
    setNewEntryStub = cy.stub().resolves();

    return (
      <CreateTenantModal
        show={show}
        handleClose={handleCloseStub}
        signup={() => {}}
        signupisLoading={signupisLoading}
        signupError={signupError}
        propertiesOwned={propertiesOwnedStub}
        setNewEntry={setNewEntryStub}
      />
    );
  }

  it("check for correct property mapping to form options", () => {
    cy.mount(<ParentComponentValid />);
    cy.get(".modal").should("be.visible");

    // The title of the modal
    cy.contains("New Tenant").should("be.visible");

    // Check that propertiesOwned is mapped correctly to form select options
    propertiesOwnedStub.forEach((property) => {
      // check that options matches the property names provided
      cy.get("option")
        .contains(property.name)
        .then((option) => {
          cy.get("select").select(option.val());

          // Assert that the selected value (_id) matches the corresponding property name
          cy.get("select").should("have.value", option.val());
        });
    });
  });

  it("check for user input and simulate successful signup", () => {
    cy.mount(<ParentComponentValid />);
    cy.get("select").select(propertiesOwnedStub[0].name);

    const newEmail = "test@example.com";
    cy.get('input[name="email"]').type(newEmail).should("have.value", newEmail);

    const newPassword = "supersecret";
    cy.get('input[name="password"]')
      .type(newPassword)
      .should("have.value", newPassword);

    cy.get("button").contains("Create").click();

    cy.get(".tenantSignUpSuccess").contains("New tenant successfully created!");
  });

  it("requires email", () => {
    cy.mount(<ParentComponentInvalid />);
    cy.get("select").select(propertiesOwnedStub[0].name);
    const newPassword = "supersecret";
    cy.get('input[name="password"]').type(newPassword);
    cy.get("button").contains("Create").click();
    cy.get('input[name="email"]').then(($input) => {
      expect($input[0].validationMessage).to.eq("Please fill in this field.");
    });
  });

  it("requires password", () => {
    cy.mount(<ParentComponentInvalid />);
    cy.get("select").select(propertiesOwnedStub[0].name);
    const newEmail = "test@example.com";
    cy.get('input[name="email"]').type(newEmail);
    cy.get("button").contains("Create").click();
    cy.get('input[name="password"]').then(($input) => {
      expect($input[0].validationMessage).to.eq("Please fill in this field.");
    });
  });

  it("requires email and password", () => {
    cy.mount(<ParentComponentInvalid />);
    cy.get("select").select(propertiesOwnedStub[0].name);
    cy.get("button").contains("Create").click();
    cy.get('input[name="password"]').then(($input) => {
      expect($input[0].validationMessage).to.eq("Please fill in this field.");
    });
    cy.get('input[name="email"]').then(($input) => {
      expect($input[0].validationMessage).to.eq("Please fill in this field.");
    });
  });

  it("requires property to be selected", () => {
    cy.mount(<ParentComponentInvalid />);
    const newEmail = "test@example.com";
    cy.get('input[name="email"]').type(newEmail).should("have.value", newEmail);

    const newPassword = "supersecret";
    cy.get('input[name="password"]')
      .type(newPassword)
      .should("have.value", newPassword);

    cy.get("button").contains("Create").click();
    cy.get('select[name="propertyid"]').then(($input) => {
      expect($input[0].validationMessage).to.eq(
        "Please select an item in the list."
      );
    });
  });
});
