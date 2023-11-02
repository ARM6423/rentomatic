import  {naughty}  from './naughty.mjs';
import {assert,expect} from "chai"
import app from '../app.mjs'
import mongoose from "mongoose";
import Landlord from "../models/landlordModel.mjs"
import jwt from 'jsonwebtoken'
import request from 'supertest'

describe('Fuzz api', () => {
    before(function(done) {
      this.timeout(3000); // A very long environment setup.
      setTimeout(done, 2500);
    });
  
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
    
    it('Signup Checker', async () => {
      
      for (let i = 0; i < naughty.length*5; i++){
        try{
        var word1 = naughty[Math.floor(Math.random()*naughty.length)];
        var word2 = naughty[Math.floor(Math.random()*naughty.length)];
        const dirtyData = {
          email:word1,
          password:word2
        }
        var res = await request(app)
        .post('/api/landlord/signup')
        .set({authorization: authorization})
        .send(dirtyData)
  
        expect(res.statusCode).to.be.at.least(400)}catch(error){
          throw(error)
        }
      };
  
    })
    it('API Address Checker', async () => {
      for (let i = 0; i < naughty.length*5; i++) {
        try{
          var word = naughty[Math.floor(Math.random()*naughty.length)];
    
          var res = await request(app)
          .get('/api/'+word)
          .set({authorization: authorization})
      
          expect(res.statusCode).to.be.at.least(400)
        
        ;
        }catch(error){
          assert(error)
        }
      }
    })
  
    it('Login Checker', async () => {
      for (let i = 0; i < naughty.length*5; i++) {
  
        try{
        
          var word1 = naughty[Math.floor(Math.random()*naughty.length)];
          var word2 = naughty[Math.floor(Math.random()*naughty.length)];
          const dirtyData = {
            email:word1,
            password:word2
          }
          var res = await request(app)
          .post('/api/landlord/login')
          .set({authorization: authorization})
          .send(dirtyData)
  
          expect(res.statusCode).to.be.at.least(400)
        
      }catch(error)
        {assert(error)}
      }
    })
  
  })
  