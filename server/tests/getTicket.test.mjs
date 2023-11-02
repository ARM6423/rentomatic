import moment from "moment";
import { expect } from "chai";
import { startOfDay, endOfDay } from "date-fns";
import mongoose from "mongoose";
import Ticket from "../models/ticketModel.mjs"; 
import { getTicket } from "../controllers/tenantController.mjs";
import { ObjectId } from "mongodb";

describe("getTicket Function", () => {

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/rentomatic_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  
  after(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clear relevant collections or reset the test database
    await Ticket.deleteMany({});
  });

  afterEach(async () => {
    // Clean up any created data
    await Ticket.deleteMany({});
  });

  it("should return all tickets posted by the tenant", async () => {
    const mockTicket =new Ticket({
      Title:"aircon credits",
      ID:"SR/2023/07/30/1",
      OP:"64c10f9f6f87d2a6d39cfe10",
      ticketStatus:"Pending",
      category:"Maintenance",
      description:"ac credits not topping up",
    });
    const mockTicket2 =new Ticket({
      Title:"water credits",
      ID:"SR/2023/07/30/2",
      OP:"64c10f9f6f87d2a6d39cfe10",
      ticketStatus:"In Progress",
      category:"Maintenance",
      description:"water is amount is too low",
    });
    const mockTicket3 =new Ticket({
      Title:"aircon credits",
      ID:"SR/2023/07/31/1",
      OP:"64c10f9f6f87d2a6d39cfe11",
      ticketStatus:"Pending",
      category:"Maintenance",
      description:"ac not working after top up",
    });

    // Save the mock ticket to the database
    await mockTicket.save();
    await mockTicket2.save();
    await mockTicket3.save();

    const req = {params: {id:new mongoose.Types.ObjectId('64c10f9f6f87d2a6d39cfe10')}};
    //const req = {params:new mongoose.Types.ObjectId('64c10f9f6f87d2a6d39cfe10')}; // Mock the request object if necessary
    const res = {
      status: (statusCode) => {
        expect(statusCode).to.equal(200);
        return res;
      },
      json: (response) => {
        expect(response.length).to.equal(2);
        for (let x of response){
          expect(String(x.OP)).to.equal("64c10f9f6f87d2a6d39cfe10");
        };
      },
    };
    await getTicket(req,res);

 });

 it("should return an empty output if no tickets of the given tenant exist", async () => {
  const mockTicket3 =new Ticket({
    Title:"aircon credits",
    ID:"SR/2023/07/30/1",
    OP:"64c10f9f6f87d2a6d39cfe11",
    ticketStatus:"Pending",
    category:"Maintenance",
    description:"ac not working after top up",
  });
  const req = {params: {id:new mongoose.Types.ObjectId('64c10f9f6f87d2a6d39cfe10')}};
  //const req = {params:new mongoose.Types.ObjectId('64c10f9f6f87d2a6d39cfe10')}; // Mock the request object if necessary
  const res = {
    status: (statusCode) => {
      expect(statusCode).to.equal(200);
      return res;
    },
    json: (response) => {
      expect(response.length).to.equal(0);
    },
  };
  await getTicket(req,res);

});

 it("should return status 400 if issues with ID", async () => {
  const req = {params: {id:" "}};
  const res = {
    status: (statusCode) => {
      expect(statusCode).to.equal(400);
      return res;
    },
    json: (response) => {
      expect(response).to.have.property("error");
    },
  };

  await getTicket(req,res);
 });
});
