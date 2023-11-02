import React from "react";
import TenantTicketForm from "./TenantTicketForm";
import { faker } from "@faker-js/faker";

const login = () => {
  cy.request({
    method: "POST",
    url: "http://localhost:5050/api/tenant/login",
    body: {
      email: "brandontenant@gmail.com",
      password: "z6ZwwrAJRdq4jzq!",
    },
  }).then((resp) => {
    window.localStorage.setItem("user", JSON.stringify(resp.body));
  });
};

const getToken = () => {
  return JSON.parse(localStorage.getItem("user"));
};

beforeEach(() => {
  login();
});

describe("<TenantTicketForm />", () => {
  it("renders", () => {
    cy.intercept("get", "http://localhost:5050/api/tenant/**").as("getID");
    let token = getToken();
    cy.mount(<TenantTicketForm email={token.email} />);
    let id = "";
    cy.wait("@getID").then((res) => {
      id = res.data;
    });
  });
  it("Check compulsory fields are not empty", () => {
    cy.intercept("get", "http://localhost:5050/api/tenant/**").as("getID");
    cy.mount(<TenantTicketForm email={"testemail@gmail.com"} />);
    let id = "";
    cy.wait("@getID").then((res) => {
      id = res.data;
    });
    //assert id is properly generated
    cy.findByRole("textbox", {
      name: /ticket id/i,
    }).should("have.value", id);
    //date is disabled
    cy.findByRole("textbox", {
      name: /date/i,
    }).should("have.attr", "disabled");
  });
  it("Empty title and description submission should fail", () => {
    cy.mount(<TenantTicketForm email={"testemail@gmail.com"} />);
    //no title & description should show error
    cy.findByRole("button", { name: /submit/i }).click({ force: true });
    cy.get("[data-cy='invalid_title']").should("be.visible");
    cy.get("[data-cy='invalid_desc']").should("be.visible");
  });
  it("Empty description should fail submission", () => {
    //no description should show error
    cy.mount(<TenantTicketForm email={"testemail@gmail.com"} />);
    cy.findByRole("textbox", { name: /ticket title/i }).type(
      faker.lorem.lines(1)
    );
    cy.findByRole("button", { name: /submit/i }).click({ force: true });
    cy.get("[data-cy='invalid_title']").should("not.be.visible");
    cy.get("[data-cy='invalid_desc']").should("be.visible");
  });
  it("Empty title should show error on submit", () => {
    //no title should show error
    cy.mount(<TenantTicketForm email={"testemail@gmail.com"} />);
    cy.findByRole("textbox", { name: /description/i }).type(
      faker.lorem.lines(3)
    );
    cy.findByRole("button", { name: /submit/i }).click({ force: true });
    cy.get("[data-cy='invalid_title']").should("be.visible");
    cy.get("[data-cy='invalid_desc']").should("not.be.visible");
  });

  it("Valid title and description should pass on submit", () => {
    let setSelectedTicketStub = cy.stub().resolves();
    cy.intercept("get", "http://localhost:5050/api/tenant/**").as("getID");
    let token = getToken();
    cy.mount(
      <TenantTicketForm
        setSelectedTicket={setSelectedTicketStub}
        email={token.email}
      />
    );
    let id = "";
    cy.wait("@getID").then((res) => {
      id = res.data;
    });
    cy.findByRole("textbox", { name: /ticket title/i }).type(
      faker.lorem.lines(1)
    );
    cy.findByRole("textbox", { name: /description/i }).type(
      faker.lorem.lines(3)
    );
    cy.findByRole("button", { name: /submit/i }).click({ force: true });
  });
});
