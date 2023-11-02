import moment from "moment";
import { expect } from "chai";
import { startOfDay, endOfDay } from "date-fns";
import { connect, disconnect } from "mongoose";
import Ticket from "../models/ticketModel.mjs"; // Replace with the actual path to your Ticket model file.
import { setID } from "../controllers/tenantController.mjs"; // Replace with the actual path to your setID function file.

describe("setID Function", () => {
  // Connect to the Mongoose database before running the test cases
  before(async () => {
    await connect("mongodb://127.0.0.1:27017/rentomatic_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  // Close the Mongoose connection after all the test cases have been executed
  after(async () => {
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

  it("should return a valid ID when there are existing tickets on the same date", async () => {
    // Create a mock ticket with a datePosted falling on the current date
    const currentDate = new Date();
    const mockTicket =new Ticket({
      Title:"aircon credits",
      ID:"SR/2023/08/03/1",
      OP:"64c10f9f6f87d2a6d39cfe10",
      ticketStatus:"Pending",
      category:"Maintenance",
      title:"Stuff happened",
      description:"ac credits bro",
    })
    const dateArray = moment(currentDate).utcOffset("+0800").format("YYYY/MM/DD").split("/");
    

    // Save the mock ticket to the database
    await mockTicket.save();

    // Call the setID function
    const req = {}; // Mock the request object if necessary
    const res = {
      status: (statusCode) => {
        expect(statusCode).to.equal(200);
        return res;
      },
      json: (response) => {
        const arr = response.split("/");
        expect(arr[0]).to.equal("SR");
        expect(arr[1]).to.equal(dateArray[0]);
        expect(arr[2]).to.equal(dateArray[1]);
        expect(arr[3]).to.equal(dateArray[2]); 
        expect(arr[4]).to.equal("2"); // As we added one ticket in the "before" hook, this should be 2.
      },
    };

    await setID(req, res);
  });

  it("should return a valid ID when there are no existing tickets on the same date", async () => {
    // Ensure there are no tickets on the current date
    const currentDate = new Date();
    const dateString=moment(currentDate).utcOffset("+0800").format("YYYY/MM/DD");
    const req = {}; // Mock the request object if necessary
    const res = {
      status: (statusCode) => {
        expect(statusCode).to.equal(200);
        return res;
      },
      json: (response) => {
        // Check that the returned ID matches the expected format with count set to 1
        expect(response).to.equal(`SR/${dateString}/${1}`);
      },
    };

    await setID(req, res);
  });

  
});
