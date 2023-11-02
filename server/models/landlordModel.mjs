import { ListCollectionsCursor } from "mongodb";
import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const Schema = mongoose.Schema;

const landlordSchema = new Schema({
  role: {
    type: String,
    default: "LANDLORD",
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
  PropertiesOwned: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
});

//Static signup method

landlordSchema.statics.signupLandlord = async function (email, password) {
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

  const landlord = await this.create({ email, password: hash });

  return landlord;
};

//static login fn

landlordSchema.statics.loginLandlord = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const landlord = await this.findOne({ email });

  if (!landlord) {
    throw Error("Wrong Email");
  }

  const match = await bcrypt.compare(password, landlord.password);

  if (!match) {
    throw Error("Wrong Password");
  }

  return landlord;
};

landlordSchema.statics.getLandlordData = async function (id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error("Landlord does not exist");
  }
  const landlord = await this.findById(id)
    .populate({
      path: "PropertiesOwned",
      populate: {
        path: "tenants",
        model: "Tenant",
      },
    })
    .exec();

  if (!landlord) {
    throw Error("Landlord does not exist");
  }

  return landlord;
};

landlordSchema.statics.checkEmail = async function (email) {
  if (!validator.isEmail(email)) {
    throw Error("New Email not valid");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in Use");
  }
  return email;
};

landlordSchema.statics.encryptPass = async function (password) {
  if (!validator.isStrongPassword(password) && password) {
    throw Error("Password too weak");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

landlordSchema.statics.createRoot = async function() {
  //validation

  const exists = await this.findOne({ email:'ROOT' });

  if (exists) {
    await this.findByIdAndDelete(exists._id)
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('ROOT', salt);

  const landlord = await this.create({ email:'ROOT', password: 'ROOT',role:"LANDLORD" });

  return landlord;
};

export default mongoose.model("Landlord", landlordSchema);
