describe("Landlord login", () => {
  beforeEach(() => {
    //landing page, click get started
    cy.visit("/");
    cy.findByRole("button", { name: /landlord login/i }).click();
  });
  it("Landlord can log in", () => {
    //login
    cy.findByRole("textbox", { name: /email/i }).type("testlandlord@gmail.com");
    cy.findByLabelText(/password/i).type("Strong@123");
    cy.findByRole("button", { name: /login/i }).click();
    cy.intercept("GET", "/api/landlord/tickets/**").as("getTickets");
    cy.wait("@getTickets");
    cy.url()
      // check if routed to dashboard
      .should("include", "/landlord")
      .then(() => {
        /* global window 
           check for JSON token*/
        const userString = window.localStorage.getItem("user");
        expect(userString).to.be.a("string");
        const user = JSON.parse(userString);
        expect(user).to.be.an("object");
        expect(user).to.have.keys(["id", "email", "role", "token"]);
        expect(user.token).to.be.a("string");
      });
    //sign out
    cy.findByRole("button", { name: /sign out/i }).click();
    cy.url().should("not.include", "/landlord");
  });

  it("Landlord does not key in any user info, unable to log in", () => {
    cy.findByRole("button", { name: /login/i }).click();
  });

  it("Landlord key only username, unable to log in", () => {
    cy.findByRole("textbox", { name: /email/i }).type("testLandlord@gmail.com");
    cy.findByRole("button", { name: /login/i }).click();
    cy.contains("All fields must be filled");
  });

  it("Landlord key only password, unable to log in", () => {
    cy.findByLabelText(/password/i).type("Strong@123");
    cy.findByRole("button", { name: /login/i }).click();
    cy.contains("All fields must be filled");
  });

  it("Landlord key wrong email, correct password, unable to log in", () => {
    cy.findByRole("textbox", { name: /email/i }).type(
      "wrongLandlord@gmail.com"
    );
    cy.findByLabelText(/password/i).type("Strong@123");
    cy.findByRole("button", { name: /login/i }).click();
    cy.contains("Wrong Email");
  });

  it("Landlord key wrong password, correct email, unable to log in", () => {
    cy.findByRole("textbox", { name: /email/i }).type("testLandlord@gmail.com");
    cy.findByLabelText(/password/i).type("wrongPassword");
    cy.findByRole("button", { name: /login/i }).click();
    cy.contains("Wrong Email");
  });
});
