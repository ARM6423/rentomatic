import { hash } from "bcrypt";
import Landlord from "../models/landlordModel.mjs";
import Property from "../models/propertyModel.mjs";
import Ticket from "../models/ticketModel.mjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const createToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.TOKENKEY);
};

// login landlord
const loginLandlord = async (req, res) => {
  const { email, password } = req.body;

  try {
    const landlord = await Landlord.loginLandlord(email, password);

    //Create Token
    const token = createToken(landlord._id, landlord.role);

    res
      .status(200)
      .json({ email, role: landlord.role, id: landlord._id, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  return;
};

//signup landlord
const signupLandlord = async (req, res) => {
  const { email, password } = req.body;

  try {
    const landlord = await Landlord.signupLandlord(email, password);

    //Create JSONToken
    const token = createToken(landlord._id, landlord.role);

    res
      .status(200)
      .json({ email, role: landlord.role, id: landlord._id, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  return;
};

//get single landlord Data based on JSON body
const getLandlordData = async (req, res) => {
  const { id } = req.params;
  try {
    const landlord = await Landlord.getLandlordData(id);
    res.status(200).json(landlord);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  return;
};

//Update the LOGGED IN Landlord
const updateLandlordData = async (req, res) => {
  const landlordID = req.landlordID;
  const { email, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(landlordID)) {
    return res.status(404).json({ error: "Landlord does not exist" });
  }

  try {
    //Check if new email and password can be used
    if (email) {
      await Landlord.checkEmail(email);
    }
    if (password) {
      //checks and returns the hashed pw
      const hash = await Landlord.encryptPass(password);
      req.body.password = hash;
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  //Function to update the Landlord User
  const landlord = await Landlord.findOneAndUpdate(
    { _id: landlordID },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!landlord) {
    return res.status(404).json({ error: "Landlord does not exist" });
  }
  res.status(200).json(landlord);
  return;
};

const delLandlord = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Landlord does not exist" });
  }
  try {
    const landlord = await Landlord.findByIdAndDelete(id);
    res.status(200).json(landlord);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  return;
};

const getAllLandlordData = async (req, res) => {
  try {
    const allLandlord = await Landlord.find({})
      .populate({
        path: "PropertiesOwned",
        populate: {
          path: "tenants",
          model: "Tenant",
        },
      })
      .exec();

    res.status(200).json(allLandlord);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  return;
};

const getProperty = async (req, res) => {
  const { propertyID } = req.params;
  try {
    // Find the property in the database based on the propertyID
    const property = await Property.findOne({ ID: propertyID });

    if (!property) {
      return res.status(404).json({ error: "Property not found." });
    }

    // Return the property details as a JSON response
    res.json(property);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error retrieving property details." });
  }
};

const createProperty = async (req, res) => {
  const { id, propertyName } = req.body;
  try {
    const property = await Property.createProperty(propertyName);
    const landlordID = id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Landlord does not Exist!");
    }

    const landlord = await Landlord.findById(id);

    var PropertiesOwned = landlord.PropertiesOwned;

    PropertiesOwned.push(property._id);

    const updatedlandlord = await Landlord.findOneAndUpdate(
      { _id: landlordID },
      {
        PropertiesOwned: PropertiesOwned,
      },
      { new: true }
    );

    res.status(200).json(property._id);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  return;
};

const deleteProperties = async (req, res) => {
  try {
    await Property.deleteMany({});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  try {
    await Landlord.updateMany({}, { PropertiesOwned: [] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  res.status(200).json("All properties deleted");
};

const getAllTickets = async (req, res) => {
  const { id } = req.params;

  try {
    // landlord object
    const landlord = await Landlord.findById(id);
    // array of properties object ID under landlord
    const properties = landlord?.PropertiesOwned;
    let tickets = [];
    if (properties) {
      for (let i = 0; i < properties.length; i++) {
        //property id
        const property = properties[i];
        //property object
        const propertyItem = await Property.findById(property);
        // array of tenant id objects
        const tenants = propertyItem?.tenants;
        if (tenants) {
          for (let j = 0; j < tenants.length; j++) {
            const ticketsTenants = await Ticket.find({ OP: tenants[j] });
            if (ticketsTenants.length !== 0) {
              for (const ticket of ticketsTenants) {
                tickets.push(ticket);
              }
            }
          }
        }
      }
    }
    res.status(200).json(tickets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  return;
};

const delProperty = async (req, res) => {
  const { id, propertyid } = req.body;
  try {
    const landlordID = id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Landlord does not Exist!");
    }

    const landlord = await Landlord.findById(id);

    function isNot(value) {
      return value != propertyid;
    }

    const checkVal = landlord.PropertiesOwned.length;
    const PropertiesOwned = landlord.PropertiesOwned.filter(isNot);
    if (checkVal == PropertiesOwned.length) {
      throw Error(PropertiesOwned.length);
    }

    const updatedlandlord = await Landlord.findOneAndUpdate(
      { _id: landlordID },
      {
        PropertiesOwned: PropertiesOwned,
      },
      { new: true }
    );

    const property = await Property.findByIdAndDelete(propertyid);
    res.status(200).json(updatedlandlord);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  return;
};

const createRoot = async (req, res) => {
  //this is property ID

  try {
    const rootUser = await Landlord.createRoot();
    const token = createToken(rootUser._id, rootUser.role);
    res
      .status(200)
      .json(
        `Root account created with Username ROOT and Password ROOT and token ${token}`
      );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  signupLandlord,
  loginLandlord,
  getLandlordData,
  updateLandlordData,
  delLandlord,
  getAllLandlordData,
  createProperty,
  delProperty,
  getAllTickets,
  deleteProperties,
  createRoot,
  getProperty,
};
