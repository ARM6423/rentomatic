import React from "react";
import TenantTicketList from "./TenantTicketList";
import dummyTickets from "../assets/dummyTickets";

describe("<TenantTicketList />", () => {
  it("renders", () => {
    // empty list , check if renders
    cy.mount(
      <TenantTicketList searchValue="" selectedFilter="null" listTickets={[]} />
    );
  });
  it("renders with mock list", () => {
    cy.mount(
      <TenantTicketList
        searchValue=""
        selectedFilter="null"
        listTickets={dummyTickets}
      />
    );
    cy.contains("This building needs fixing!");
    //check if it renders 7 items on first page correctly
    cy.get("[data-cy='datatable']").find("tr").its("length").should("eq", 7);
  });
});
