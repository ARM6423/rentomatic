import request from 'supertest'
import app from '../app.mjs'
import dotenv from "dotenv";
import mongoose from "mongoose";
import {assert,expect} from "chai"
import Landlord from "../models/landlordModel.mjs"
import jwt from 'jsonwebtoken'
import  {naughty}  from './naughty.mjs';


describe('Landlord Signup', () => {

  before(async () => {
    // Establish a connection to the test database
    await mongoose.connect('mongodb://localhost/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoose.connection.db.dropDatabase();
    const rootUser = await Landlord.signupLandlord("APITESTING@ADMIN.USER","Strong@123")
    
    const token = jwt.sign({_id:rootUser._id, role:rootUser.role }, process.env.TOKENKEY)
    global.authorization = `Bearer ${token}`
    
  });
  
  after(async () => {
    // Close the database connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });
  
  

  it('Signup Validator', async () => {

    const wrongEmail ={
        "email": "ServersideUnit",
        "password": "Strong@123"
    }
    
    var res = await request(app)
    .post('/api/landlord/signup')
    .set({authorization: authorization})
    .send(wrongEmail)
    
    
    expect(res.statusCode).to.equal(400)

    const weakPassword ={
      "email": "ServersideUnit@Testing.test",
      "password": "password"
    }
    res = await request(app)
    .post('/api/landlord/signup')
    .set({authorization: authorization})
    .send(weakPassword)

    expect(res.statusCode).to.equal(400)


    var noOfLandlord = await Landlord.count()
    expect(noOfLandlord).to.equal(1)
    

  })

  it('Signup Should Succeed with token Returned', async () => {
    
    const inputData ={
        "email": "ServersideUnit@Testing.test",
        "password": "Strong@123"
    }
    
    const res = await request(app)
    .post('/api/landlord/signup')
    .set({authorization: authorization})
    .send(inputData)
    
  
    expect(res.statusCode).to.equal(200)
    expect(res.body.email).to.equal(inputData.email)
    expect(res.body.role).to.equal("LANDLORD")
    expect(res.body.token).to.exist
    const noOfLandlord = await Landlord.count()
    expect(noOfLandlord).to.equal(2)

  })

  it('Should not sign up with email in DB', async () => {

    const inputData ={
        "email": "ServersideUnit@Testing.test",
        "password": "Strong@123"
    }
    const res = await request(app)
    .post('/api/landlord/signup')
    .set({authorization: authorization})
    .send(inputData)
    
    expect(res.statusCode).to.equal(400)
  
    const noOfLandlord = await Landlord.count()
    expect(noOfLandlord).to.equal(2)

  })

})


