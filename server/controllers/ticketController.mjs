import Ticket from "../models/ticketModel.mjs";
import mongoose from "mongoose";

const submitInvoice = async (req, res) => {
  /*** Saves invoice PDF to a ticket
   * Requires:
   * (req.params) Ticket_id : ticket object id (_id)
   * Returns:
   * json respon containing ticket
   */

  // Check if user is authenticated
  /**
     * if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated. '});
    }
    // Check if user is Landlord, return status 403 otherwise
    if (req.user.userType !== 'Landlord') {
        return res.status(403).json({ error: 'Unauthorized. Only Landlords can access this endpoint.' });
    }
     */

  // Get ticket from database
  const { Ticket_id } = req.params;
  const invoiceImage = req.file.filename;
  try {
    if (!mongoose.Types.ObjectId.isValid(Ticket_id)) {
      throw Error("Ticket does not Exist!");
    }
    const ticket = await Ticket.findById(Ticket_id);
    let updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticket._id },
      {
        invoiceImage: invoiceImage,
        invoiceNeeded: true,
        acceptanceByTenant: false,
        ticketStatus: "In Progress",
      },
      { new: true }
    );
    res.status(200).json(updatedTicket);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const noInvoice = async (req, res) => {
  const { Ticket_id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(Ticket_id)) {
      throw Error("Ticket does not Exist!");
    }
    const ticket = await Ticket.findById(Ticket_id);
    let updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticket._id },
      {
        invoiceNeeded: false,
        ticketStatus: "In Progress",
      },
      { new: true }
    );
    res.status(200).json(updatedTicket);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const acceptInvoice = async (req, res) => {
  const { Ticket_id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(Ticket_id)) {
      throw Error("Ticket does not Exist!");
    }
    const ticket = await Ticket.findById(Ticket_id);
    let updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticket._id },
      {
        acceptanceByTenant: true,
      },
      { new: true }
    );
    res.status(200).json(updatedTicket);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const completeTicket = async (req, res) => {
  const { Ticket_id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(Ticket_id)) {
      throw Error("Ticket does not Exist!");
    }
    const ticket = await Ticket.findById(Ticket_id);
    let updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticket._id },
      {
        ticketStatus: "Complete",
      },
      { new: true }
    );
    res.status(200).json(updatedTicket);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteTickets = async (req, res) => {
  try {
    await Ticket.deleteMany({});
    res.status(200).json("success");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  submitInvoice,
  acceptInvoice,
  completeTicket,
  noInvoice,
  deleteTickets,
};
