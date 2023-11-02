import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
//import records from "./routes/record.mjs";
import { landlordRoutes, landlordRoutesAuth } from "./routes/landlord.mjs";
import {
  tenantRoutes,
  tenantRoutesAuth,
  tenantRouteLandlordAuth,
} from "./routes/tenant.mjs";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use(express.static("invoice"));
//Routes
//app.use("/record", records);
app.use("/api/landlord", landlordRoutes, landlordRoutesAuth);

app.use("/api/tenant", tenantRoutes, tenantRoutesAuth, tenantRouteLandlordAuth);

export default app