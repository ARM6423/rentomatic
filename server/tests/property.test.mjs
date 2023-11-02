import { expect } from 'chai';
import mongoose from 'mongoose';
import Property from '../models/propertyModel.mjs';

describe('Property Model', () => {
  before(async () => {
    // Establish a connection to the test database
    await mongoose.connect('mongodb://localhost/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    // Close the database connection
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear relevant collections or reset the test database
    await Property.deleteMany({});
  });

  afterEach(async () => {
    // Clean up any created data
    await Property.deleteMany({});
  });

  it('should create a new property', async () => {
    const propertyData = {
      name: 'Test Property',
      tenants: []
    };

    const newProperty = await Property.create(propertyData);

    expect(newProperty).to.be.an('object');
    expect(newProperty).to.have.property('name', 'Test Property');
    expect(newProperty).to.have.property('tenants').that.is.an('array').and.is.empty;
    expect(newProperty).to.have.property('_id').that.is.an.instanceOf(mongoose.Types.ObjectId);
  });

  it('should require the name field', async () => {
    const propertyData = {
      tenants: []
    };

    try {
      await Property.create(propertyData);
      // The create operation should throw an error for missing required fields
      expect.fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).to.exist;
      expect(error.name).to.equal('ValidationError');
      expect(error.errors).to.have.property('name');
    }
  });

  // Add more test cases to cover other aspects of the model's behavior
});
