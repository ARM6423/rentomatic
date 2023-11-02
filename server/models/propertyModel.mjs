import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tenants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },
  ],
});

PropertySchema.statics.createProperty = async function (propertyName) {
  //validation
  if (!propertyName) {
    throw Error("Please give a property Name");
  }

  const exists = await this.findOne({ name: propertyName });

  if (exists) {
    throw Error("Property already Exists");
  }
  const property = await this.create({ name: propertyName });

  return property;
};

const Property = mongoose.model("Property", PropertySchema);
export default Property;
