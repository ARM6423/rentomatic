import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },

  ID: {
    type: String,
    // Manual ID
    required: true,
    unique: true,
  },
  // Original Poster
  OP: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TenantUser",
    required: true,
  },
  ticketStatus: {
    type: String,
    enum: ["Pending", "In Progress", "Complete"],
    default: "Pending",
    required: true,
  },
  // Acceptance of invoice by tenant if any
  category: {
    type: String,
    // TODO: Add more categories
    enum: ["Maintenance", "Property Damage", "Extension", "Infestations"],
    required: true,
  },
  description: {
    type: String,
    default: "",
    required: true,
  },
  image: {
    type: String,
  },
  datePosted: {
    type: Date,
    default: new Date(),
    immutable: true, // Prevents change
  },
  invoiceNeeded: {
    type: Boolean,
    default: null,
  },
  acceptanceByTenant: {
    type: Boolean,
    default: null,
  },
  invoiceImage: {
    type: String,
  },
  feedbackGiven: {
    type: Boolean,
    default: null,
  },
  feedbackDesc: {
    type: String,
    default: null,
  },
  feedbackRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
});

ticketSchema.statics.createTicket = async function ({
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
}) {
  //validation
  if (!ID) {
    throw Error("Please give a ID");
  }

  const exists = await this.findOne({ ID: ID });

  if (exists) {
    throw Error("Ticket already exists");
  }
  const ticket = await this.create({
    Title: Title,
    ID: ID,
    OP: OP,
    ticketStatus: ticketStatus,
    category: category,
    description: description,
    image: image,
    datePosted: datePosted,
    invoiceNeeded: invoiceNeeded,
    acceptanceByTenant: acceptanceByTenant,
    invoiceImage: invoiceImage,
  });

  return ticket;
};

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
