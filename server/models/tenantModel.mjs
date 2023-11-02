import { ListCollectionsCursor } from "mongodb";
import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const Schema = mongoose.Schema;

const tenantSchema = new Schema({
  role: {
    type: String,
    default: "TENANT",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
  },
  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
});
//TODO: change string list to Tickets
// TODO: Whatever was done to Landlord to be done to Tenants in Controller

//Static signup method

tenantSchema.statics.signupTenant = async function (email, password) {
  //validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Weak Password");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const tenant = await this.create({ email, password: hash });

  return tenant;
};

//static login fn

tenantSchema.statics.loginTenant = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const tenant = await this.findOne({ email });

  if (!tenant) {
    throw Error("Wrong Email");
  }

  const match = await bcrypt.compare(password, tenant.password);

  if (!match) {
    throw Error("Wrong Password");
  }

  return tenant;
};

tenantSchema.statics.getTenantData = async function (id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error("Tenant does not exist");
  }
  const tenant = await this.findById(id);

  if (!tenant) {
    throw Error("Tenant does not exist");
  }

  tenant.password = "MASKED";
  return tenant;
};

tenantSchema.statics.checkEmail = async function (email) {
  if (!validator.isEmail(email)) {
    throw Error("New Email not valid");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in Use");
  }
  return email;
};

tenantSchema.statics.encryptPass = async function (password) {
  if (!validator.isStrongPassword(password) && password) {
    throw Error("Password too weak");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

export default mongoose.model("Tenant", tenantSchema);
