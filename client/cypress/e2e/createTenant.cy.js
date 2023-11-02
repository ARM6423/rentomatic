import { faker } from "@faker-js/faker/locale/en";

describe("Landlord creates a property and new tenant", () => {
  let propertyName = faker.company.name();
  let tenantEmail = faker.internet.email();
  let tenantPassword = "Strong@123";
  it("Landlord adds a new property then new tenant to property", () => {
    cy.Landlordlogin("testlandlord@gmail.com", "Strong@123");
    //create new property
    cy.request("patch", "http://localhost:5050/api/landlord/deleteProperties");
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
    cy.request("patch", "http://localhost:5050/api/tenant/deleteAllTenants");
    cy.get('[data-cy="tenantCount"]').should("have.text", "0 Tenants");
    cy.findByRole("button", { name: /new tenant\.\.\./i }).click();
    cy.get("select").select(propertyName);

    cy.findByRole("textbox", { name: /email address/i }).type(tenantEmail);
    cy.findByLabelText(/password/i).type(tenantPassword);
    cy.findByRole("button", { name: /create/i }).click();
    cy.wait("@getData");
    //creation of tenant success
    cy.contains("New tenant successfully created!");
    cy.get('[data-cy="close"]').click();
    //check if theres 1 tenant count
    cy.get('[data-cy="tenantCount"]').should("have.text", "1 Tenants");
    //sign out
    cy.findByRole("button", { name: /sign out/i }).click();
  });
  it("Log into newly created tenant account", () => {
    cy.visit("/");
    cy.findByRole("button", { name: /tenant login/i }).click();
    cy.findByRole("textbox", { name: /email/i }).type(tenantEmail);
    cy.findByLabelText(/password/i).type(tenantPassword);
    cy.findByRole("button", { name: /login/i }).click();
    cy.intercept("/api/tenant/**").as("getTickets");
    cy.wait("@getTickets");
    //successful login
    cy.url().should("include", "/tenant");
  });
});
