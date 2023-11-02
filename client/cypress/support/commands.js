import "@testing-library/cypress/add-commands";

Cypress.Commands.add("Landlordlogin", (email, password) => {
  cy.visit("/");
  cy.findByRole("button", { name: /landlord login/i }).click();
  cy.findByRole("textbox", { name: /email/i }).type(email);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole("button", { name: /login/i }).click();
  cy.intercept("GET", "/api/landlord/tickets/**").as("getTickets");
  cy.wait("@getTickets");
});

Cypress.Commands.add("tenantSignUpLogin", (email, password, propertyName) => {
  cy.Landlordlogin("testlandlord@gmail.com", "Strong@123");
  //create new property
  cy.findByRole("button", { name: /settings/i }).click();
  cy.get('[data-cy="propertyCount"]').should("have.text", "0 Properties");

  cy.findByRole("textbox", { name: /property input field/i }).type(
    propertyName
  );
  cy.findByRole("button", { name: /add property/i }).click();
  //successfully create new property
  cy.intercept("/api/landlord/**").as("getData");
  cy.wait("@getData");
  //check if there's 1 property
  cy.get('[data-cy="propertyCount"]').should("have.text", "1 Properties");
  //create new tenant
  cy.get('[data-cy="tenantCount"]').should("have.text", "0 Tenants");
  cy.findByRole("button", { name: /new tenant\.\.\./i }).click();
  cy.get("select").select(propertyName);

  cy.findByRole("textbox", { name: /email address/i }).type(email);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole("button", { name: /create/i }).click();
  cy.wait("@getData");
  //creation of tenant success
  cy.contains("New tenant successfully created!");
  cy.get('[data-cy="close"]').click();
  //check if theres 1 tenant count
  cy.get('[data-cy="tenantCount"]').should("have.text", "1 Tenants");
  cy.request({
    method: "POST",
    url: "http://localhost:5050/api/tenant/login",
    body: { email, password },
  }).then((res) => {
    window.localStorage.setItem("user", JSON.stringify(res.body));
  });

  Cypress.Commands.add("tenantLogin", (email, password) => {
    cy.visit("/");
    cy.findByRole("button", { name: /tenant login/i }).click();
    cy.findByRole("textbox", { name: /email/i }).type(email);
    cy.findByLabelText(/password/i).type(password);
    cy.findByRole("button", { name: /login/i }).click();
    cy.intercept("/api/tenant/**").as("getTickets");
    // click on create ticket
    cy.wait("@getTickets");
  });
});
