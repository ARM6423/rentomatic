import {expect,assert} from 'chai'
import mongoose from 'mongoose'
import Landlord from '../models/landlordModel.mjs'
import {
  signupLandlord,
  loginLandlord,
  getLandlordData,
  updateLandlordData,
  delLandlord,
  getAllLandlordData,
  createProperty,
  delProperty,
  getAllTickets
} from "../controllers/landlordController.mjs";
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'




describe('Landlord Model', () => {
  
  before(async () => {
    // Establish a connection to the test database
    await mongoose.connect(process.env.MONGO_TEST, { 
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
    await Landlord.deleteMany({});
  });

  afterEach(async () => {
    // Clean up any created data
    await Landlord.deleteMany({});
  });

  it('Signup Function in model should create new Landlord w/o saving password in raw data', async () => {
    // Create a mock request object with a file buffer and the user role as "Landlord"
    const inputData = {
      email: 'Tester@test.com',
      password: 'Strong@123',
      }
    
    const newLandlord = await Landlord.signupLandlord('Tester@test.com','Strong@123');

    expect(newLandlord).to.be.an('object');
    expect(newLandlord).to.have.property('email', 'Tester@test.com');
    expect(newLandlord).to.have.property('PropertiesOwned').that.is.an('array').and.is.empty;
    expect(newLandlord).to.have.property('_id').that.is.an.instanceOf(mongoose.Types.ObjectId);
    assert(bcrypt.compare('Strong@123', newLandlord.password));
    
  });

    

})
