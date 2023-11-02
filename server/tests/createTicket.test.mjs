import { expect } from "chai";
import { createTicket } from "../controllers/tenantController.mjs"; 
import Ticket from "../models/ticketModel.mjs"; 
import Tenant from "../models/tenantModel.mjs"; 
import mongoose, { connect, disconnect } from 'mongoose';

describe("createTicket function", () => {
  before(async () => {
    // Connect to the test database before running the tests
    await connect('mongodb://127.0.0.1:27017/rentomatic_test', { useNewUrlParser: true });
  });

  after(async () => {
    // Disconnect from the test database after the tests are done
    await disconnect();
  });

  beforeEach(async () => {
    // Clear relevant collections or reset the test database
    await Ticket.deleteMany({});
  });

  afterEach(async () => {
    // Clean up any created data
    await Ticket.deleteMany({});
  });

  it("should create a new ticket with valid input", async () => {
    // Mock request object with required properties
    const req = {
      body: {
        Title:"aircon credits",
        ID:"SR/2023/07/30/1",
        OP:"64c10f9f6f87d2a6d39cfe10",
        ticketStatus:"Pending",
        category:"Maintenance",
        description:"ac credits bro",
      },
      file: {
        filename: "mock_image.jpg",
      },
    };

    const res = {
      status: (statusCode) => {
        expect(statusCode).to.equal(200);
        return res;
      },
      json: (response) => {
        expect(response).to.have.property("OP");
        expect(response).to.have.property("Title", "aircon credits");
        expect(response).to.have.property("ID", "SR/2023/07/30/1");
        expect(response).to.have.property("ticketStatus", "Pending");
        expect(response).to.have.property("category", "Maintenance");
        expect(response).to.have.property("description", "ac credits bro");
      },
    };

    // Call the createTicket function
    await createTicket(req, res);
  });

  it("should handle errors and return status 400 for invalid input", async () => {
    const req = {
      body: {
        // Missing required properties
      },
      file: {
        // Missing file
      },
    };

    const res = {
      status: (statusCode) => {
        expect(statusCode).to.equal(400);
        return res; // Chaining the methods
      },
      json: (response) => {
        expect(response).to.have.property("error");
      },
    };

    await createTicket(req, res);
  });
});
