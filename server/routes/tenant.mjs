import express from "express";
import {
  requireLandlordAuth,
  requireBasicAuth,
} from "../middleware/requireAuth.mjs";
import { upload } from "../middleware/multer.mjs";
import {
  acceptInvoice,
  deleteTickets,
} from "../controllers/ticketController.mjs";
//controller fn
import {
  signupTenant,
  loginTenant,
  updateTenantData,
  getTenantData,
  getAllTenantData,
  delTenant,
  createTicket,
  getTicket,
  setID,
  submitFeedback,
  deleteTenants,
} from "../controllers/tenantController.mjs";

const tenantRoutes = express.Router();
const tenantRoutesAuth = express.Router();
const tenantRouteLandlordAuth = express.Router();

tenantRoutesAuth.use(requireBasicAuth);
tenantRouteLandlordAuth.use(requireLandlordAuth);

//login
tenantRoutes.post("/login", loginTenant);

//signup
//Should be tenantRouteLandlordAuth
tenantRouteLandlordAuth.post("/signup", signupTenant);
//Update logged in Tenant
//Should be tenantRoutesAuth
//MIGHT BE BROKEN WITHOUT AUTHENTICATION
tenantRoutesAuth.patch("/edit", updateTenantData);

//delete all tenants
tenantRouteLandlordAuth.patch("/deleteAllTenants", deleteTenants);

//Get tenant Data
//Should be tenantRoutesAuth
tenantRoutesAuth.get("/:id", getTenantData);

//Get all TenantData
//Should be tenantRouteLandlordAuth
tenantRouteLandlordAuth.get("/", getAllTenantData);

//del Tenant
//Should be tenantRouteLandlordAuth
tenantRouteLandlordAuth.delete("/del/:id", delTenant);

// create a ticket
tenantRoutesAuth.post("/createticket", upload.single("image"), createTicket);

//accept invoice from landlord
tenantRoutesAuth.patch("/acceptInvoice/:Ticket_id", acceptInvoice);

//get All tenant tickets
tenantRoutesAuth.get("/tickets/all/:id", getTicket);

//set new ticket ID
tenantRoutesAuth.get("/tickets/setID", setID);

//submit tenant feedback
tenantRoutesAuth.patch("/submitFeedback", submitFeedback);

tenantRoutesAuth.patch("/deleteTickets", deleteTickets);

export { tenantRoutes, tenantRoutesAuth, tenantRouteLandlordAuth };
