import Tenant from "../models/tenantModel.mjs";
import Ticket from "../models/ticketModel.mjs";
import Property from "../models/propertyModel.mjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { startOfDay, endOfDay } from "date-fns";
import moment from "moment";

const createToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.TOKENKEY);
};

// login tentant
const loginTenant = async (req, res) => {
  const { email, password } = req.body;

  try {
    const tenant = await Tenant.loginTenant(email, password);

    //Create Token
    const token = createToken(tenant._id, tenant.role);

    res.status(200).json({ email, role: tenant.role, id: tenant._id, token });
    return;
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
};

//signup tenant
const signupTenant = async (req, res) => {
  const { email, password, propertyid } = req.body;

  try {
    const tenant = await Tenant.signupTenant(email, password);
    const property = await Property.findById(propertyid);

    var tenants = property.tenants;
    tenants.push(tenant._id);
    const updatedproperty = await Property.findOneAndUpdate(
      { _id: propertyid },
      {
        tenants: tenants,
      }
    );

    res.status(200).json(updatedproperty);

    return;
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
};

const deleteTenants = async (req, res) => {
  try {
    await Tenant.deleteMany({});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  try {
    await Property.updateMany({}, { tenants: [] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  res.status(200).json("Succesfully deleted all tenants");
};

//Update the LOGGED IN Tenant
const updateTenantData = async (req, res) => {
  const tenantID = req.tenantID;
  const { email, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(tenantID)) {
    return res.status(404).json({ error: "Tenant does not exist" });
  }

  try {
    //Check if new email and password can be used
    if (email) {
      await Tenant.checkEmail(email);
    }
    if (password) {
      //checks and returns the hashed pw
      const hash = await Tenant.encryptPass(password);
      req.body.password = hash;
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  //Function to update the Tenant User
  const tenant = await Tenant.findOneAndUpdate(
    { _id: tenantID },
    {
      ...req.body,
    }
  );

  if (!tenant) {
    return res.status(404).json({ error: "Tenant does not exist" });
  }
  res.status(200).json(tenant);
  return;
};

//get single tenant Data based on JSON body
const getTenantData = async (req, res) => {
  const { id } = req.params;
  try {
    const tenant = await Tenant.getTenantData(id);
    res.status(200).json(tenant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  return
}

//accept invoice

const acceptInvoice = async (req, res) => {
    const { TicketID } = req.params;
    try {
        // Check if the ticket exists in the database
        const ticket = await Ticket.findOne({ ID: TicketID });
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found.' });
        }

        // Ensure the user accepting the invoice is a tenant
        // You need some way to authenticate and identify the tenant user here
        // For example, you might use a token or session to identify the user
        // If the user is not authenticated as a tenant, return a 403 Forbidden status
        // and appropriate error message.

        // Proceed with the acceptance process
        ticket.invoiceAccepted = true;
        ticket.ticketStatus = "Accepted"; // Or any other status indicating acceptance

        // Save the updated ticket with the acceptance status
        await ticket.save();

        res.json(ticket);
    } catch (error) {
        return res.status(500).json({ error: 'Error accepting invoice.' });
    }
};

const getAllTenantData = async (req, res) => {
  try {
    const allTenant = await Tenant.find({});
    res.status(200).json(allTenant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  return;
};

const delTenant = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Tenant does not exist" });
  }
  try {
    const tenant = await Tenant.findByIdAndDelete(id);
    res.status(200).json(tenant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  return;
};

// Create ticket tenant
// Create ticket tenant
const createTicket = async (req, res) => {
  try {
    const {
      Title,
      ID,
      OP,
      ticketStatus,
      category,
      description,
      datePosted,
      invoiceNeeded,
      acceptanceByTenant,
      invoiceImage,
    } = req.body;

    const image = req.file?.filename;

    const tenant = await Tenant.findById(OP);
    const ticket = await Ticket.createTicket({
      Title,
      ID,
      OP,
      ticketStatus,
      category,
      description,
      image,
      datePosted,
      invoiceNeeded,
      acceptanceByTenant,
      invoiceImage,
    });

    tenant?.tickets?.push(ticket._id);

    res.status(200).json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get ticket
const getTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const tickets = await Ticket.find({ OP: id }).sort({
      datePosted: -1,
    });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//set ID for ticket
const setID = async (req, res) => {
  const currentDate = new Date();
  const dateString = moment(currentDate)
    .utcOffset("+0800")
    .format("YYYY/MM/DD");
  const ID = "";
  try {
    const tickets = await Ticket.find({
      datePosted: {
        $gte: startOfDay(currentDate),
        $lte: endOfDay(currentDate),
      },
    });
    const newID = `SR/${dateString}/${tickets.length + 1}`;
    res.status(200).json(newID);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const submitFeedback = async (req, res) => {
  try {
    const { ID, rating, comments } = req.body;

    const ticket = await Ticket.findOne({ ID: ID });

    if (!ticket) {
      return res.status(400).json({ error: "Ticket not found." });
    }

    ticket.feedbackGiven = true;
    ticket.feedbackRating = rating;
    ticket.feedbackDesc = comments;

    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  signupTenant,
  loginTenant,
  updateTenantData,
  getTenantData,
  getAllTenantData,
  delTenant,
  createTicket,
  setID,
  getTicket,
  acceptInvoice,
  submitFeedback,
  deleteTenants,
};
