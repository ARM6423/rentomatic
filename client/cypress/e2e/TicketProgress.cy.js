import { faker } from "@faker-js/faker/locale/en";

describe("Ticket process", () => {
  it("Tenant can create ticket", () => {
    cy.request("patch", "http://localhost:5050/api/tenant/deleteTickets");
    cy.request("patch", "http://localhost:5050/api/landlord/deleteProperties");
    cy.request("patch", "http://localhost:5050/api/tenant/deleteAllTenants");
    cy.tenantSignUpLogin(
      "testtenant@gmail.com",
      "Strong@123",
      "ChangiCityPoint"
    );
    let ticketTitle = faker.lorem.sentence();
    let ticketDescription = faker.lorem.sentences(4);
    cy.intercept("/api/tenant/tickets/**").as("getTickets");
    cy.visit("/tenant");
    // click on create ticket
    cy.wait("@getTickets");
    cy.get('[data-cy="pendingCount"]').should("have.text", "Pending: 0");
    cy.findByRole("button", { name: /create ticket/i }).click();
    // select property damage category
    cy.get("select").select("Property Damage");
    //fill in title, description, insert image
    cy.findByRole("textbox", {
      name: /ticket title/i,
    }).type(ticketTitle);
    cy.findByRole("textbox", {
      name: /description/i,
    }).type(ticketDescription);
    cy.get("input[type=file]").selectFile("cypress/fixtures/sampleHouse.jpg");
    //submit
    cy.findByRole("button", { name: /submit/i }).click();
    //go to pending tickets and see new ticket created
    cy.wait("@getTickets");
    //verify if ticket is created
    cy.get('[data-cy="pendingCount"]').should("have.text", "Pending: 1");
    cy.contains(ticketTitle).parents("tr").click();
    cy.findByRole("heading", {
      name: /pending ticket/i,
    }).should("exist");
  });

  it("Landlord can submit invoice and change ticket status", () => {
    cy.Landlordlogin("testlandlord@gmail.com", "Strong@123");
    cy.intercept("GET", "/api/landlord/tickets/**").as("getTickets");
    cy.visit("/landlord");
    cy.wait("@getTickets");
    //Landlord click on new ticket
    cy.contains("Property Damage").parents("tr").click();
    cy.get(".right-container-details").scrollTo("bottom");
    cy.get("input[type=file]").selectFile("cypress/fixtures/dummy.pdf");
    cy.findByRole("checkbox").click();
    cy.intercept("patch", "/api/landlord/submitInvoice/*").as("submitInvoice");
    cy.findByRole("button", {
      name: /accept/i,
    }).click();
    //submit invoice success, status changes to in-progress
    cy.wait("@submitInvoice");
    cy.contains("Property Damage").parents("tr").click();
    cy.findByRole("heading", {
      name: /ticket in\-progress/i,
    }).should("exist");
  });

  it("Tenant can accept the Landlords invoice", () => {
    cy.intercept("/api/tenant/**").as("getTickets");
    cy.tenantLogin("testtenant@gmail.com", "Strong@123");
    // Log into tenant account
    cy.contains("Awaiting Acceptance");
    cy.contains("Property Damage").parents("tr").click();
    cy.get(".right-container-details").scrollTo("bottom");
    //tenant accept the terms and condition and submit
    cy.findByRole("checkbox").click();
    cy.findByRole("button", {
      name: /accept/i,
    }).click();
    cy.wait("@getTickets");
    cy.contains("Accepted");
    cy.contains("Property Damage").parents("tr").click();
    cy.get(".right-container-details").scrollTo("bottom");
    //check that status is accepted invoice
    cy.contains(
      "You have accepted the invoice and the issue is being actively worked on."
    );
  });

  it("Landlord can complete the ticket", () => {
    //login to landlord
    cy.Landlordlogin("testlandlord@gmail.com", "Strong@123");
    cy.intercept("GET", "/api/landlord/tickets/**").as("getTickets");
    cy.visit("/landlord");
    cy.wait("@getTickets");
    //Landlord click on in-progress ticket
    cy.contains("Property Damage").parents("tr").click();
    cy.get(".right-container-details").scrollTo("bottom");
    cy.intercept("patch", "http://localhost:5050/api/landlord/**").as(
      "completeTicket"
    );
    cy.get("button[type=submit]").click();
    //complete ticket
    cy.wait("@completeTicket");
    cy.intercept("GET", "/api/tenant/*").as("getTenant");
    cy.contains("Property Damage").parents("tr").click();
    cy.wait("@getTenant");
    cy.contains("Property Damage").parents("tr").click();
    cy.wait(1);
    cy.contains("Ticket resolved");
  });

  it("Tenant submits feedback for completed ticket", () => {
    //login to tenant
    cy.intercept("/api/tenant/**").as("getTickets");
    cy.tenantLogin("testtenant@gmail.com", "Strong@123");
    cy.contains("Property Damage").parents("tr").click();
    cy.get(".right-container-details").scrollTo("bottom");
    //click submit feedback button
    cy.findByRole("button", {
      name: /submit feedback/i,
    }).click();
    cy.findByRole("textbox", {
      name: /any thoughts or concerns you'd like to share\?/i,
    }).type(faker.lorem.lines(2));
    cy.get('[data-cy="submit"]').click();
    cy.wait("@getTickets");
    //check successful feedback
    cy.contains("You have successfully submitted your feedback!");
    cy.contains("Close").click();
  });

  it("Landlord checks for feedback ticket", () => {
    //login to landlord
    cy.Landlordlogin("testlandlord@gmail.com", "Strong@123");
    cy.intercept("GET", "/api/landlord/tickets/**").as("getTickets");
    cy.visit("/landlord");
    cy.wait("@getTickets");
    //Landlord click on in-progress ticket
    cy.contains("Property Damage").parents("tr").click();
    cy.get(".right-container-details").scrollTo("bottom");
    cy.contains("Tenant Feedback:");
  });
});
