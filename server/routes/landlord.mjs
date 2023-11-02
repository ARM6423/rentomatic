import express from "express";
import {
  submitInvoice,
  noInvoice,
  completeTicket,
} from "../controllers/ticketController.mjs";
//controller fn

import { invoiceUpload } from "../middleware/multer.mjs";

const router = express.Router();
import {
  requireLandlordAuth,
  requireBasicAuth,
} from "../middleware/requireAuth.mjs";

//controller fn
import {
  signupLandlord,
  loginLandlord,
  getLandlordData,
  updateLandlordData,
  delLandlord,
  getAllLandlordData,
  getProperty,
  createProperty,
  delProperty,
  getAllTickets,
  deleteProperties,
  createRoot
} from "../controllers/landlordController.mjs";

const landlordRoutes = express.Router();
const landlordRoutesAuth = express.Router();


landlordRoutes.post("/login", loginLandlord);


//signup
//Should be landlordRoutesAuth
landlordRoutesAuth.post("/signup", signupLandlord);

//Get landlord Data
//Should be landlordRoutesAuth
landlordRoutesAuth.get("/:id", getLandlordData);

//Update LandlordData
//Should be landlordRoutesAuth
//MIGHT NOT WORK WITHOUT THE AUTHENTICATION
landlordRoutesAuth.patch("/edit", updateLandlordData);

//del Landlord
//Should be landlordRoutesAuth
landlordRoutesAuth.delete("/del/:id", delLandlord);

//get ALL landlord Datas
//Should be landlordRoutesAuth
landlordRoutesAuth.get("/", getAllLandlordData);

landlordRoutes.get('/properties/:propertyID', getProperty); // New route for getting property details
//create Property in landlord
//Should be landlordRoutesAuth
landlordRoutesAuth.post("/property/create", createProperty);
//delete Property in landlord
//Should be landlordRoutesAuth
landlordRoutesAuth.delete("/property/del",delProperty)

//get All tickets under landlord
//should be landlordRoutesAuth
landlordRoutesAuth.get("/tickets/all/:id", getAllTickets);

// submitInvoice
// Define the API route that checks the 'Landlord' user type, gets the ticket by ticket Object '_id', and attaches an image to the ticket's 'Invoice' attribute
landlordRoutesAuth.patch(
  "/submitInvoice/:Ticket_id",
  invoiceUpload.single("invoiceImage"),
  submitInvoice
);

//pending -> in-progress but no invoice is needed from landlord
landlordRoutesAuth.patch("/noInvoice/:Ticket_id", noInvoice);

//complete ticket from in-progress to complete
landlordRoutesAuth.patch("/completeTicket/:Ticket_id", completeTicket);

landlordRoutesAuth.patch("/deleteProperties", deleteProperties);

// comment out when not in use
// landlordRoutes.get("/devTools/createRootUser",createRoot)

export { landlordRoutes, landlordRoutesAuth };
