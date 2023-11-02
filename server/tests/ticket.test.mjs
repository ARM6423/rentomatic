import { expect } from 'chai';
import mongoose from 'mongoose';
import Ticket from '../models/ticketModel.mjs';


describe('Ticket Model', () => {
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
    await Ticket.deleteMany({});
  });

  afterEach(async () => {
    // Clean up any created data
    await Ticket.deleteMany({});
  });

  it('should create a new ticket', async () => {
    const ticketData = {
      Title: 'Test',
      ID: '123456',
      OP: new mongoose.Types.ObjectId(),
      ticketStatus: 'Pending',
      category: 'Property Damage',
      description: 'Some description',
 //     image: {
//      data: Buffer.from('binary-data'),
//     contentType: 'image/png'
//  },
      invoiceNeeded: true
    };

    const newTicket = await Ticket.create(ticketData);

    expect(newTicket).to.be.an('object');
    expect(newTicket).to.have.property('ID', '123456');
    expect(newTicket).to.have.property('OP').that.is.an.instanceOf(mongoose.Types.ObjectId);
    expect(newTicket).to.have.property('ticketStatus', 'Pending');
    expect(newTicket).to.have.property('category', 'Property Damage');
    expect(newTicket).to.have.property('description', 'Some description');

//    expect(newTicket).to.have.property('image').that.deep.equals({
//     data: Buffer.from('binary-data'),
//      contentType: 'image/png'
//    });

    /**expect(newTicket).to.have.property('image').that.eql({
      data: Buffer.from('binary-data'),
      contentType: 'image/png'
    }); */
    expect(newTicket).to.have.property('datePosted').that.is.an.instanceOf(Date);
    expect(newTicket).to.have.property('invoiceNeeded', true);
    expect(newTicket).to.have.property('invoiceImage', undefined);
  });

  it('should require the ID field', async () => {
    const ticketData = {
      Title: 'Test',
      OP: new mongoose.Types.ObjectId(),
      ticketStatus: 'Pending',
      category: 'Property Damage',
      description: 'Some description',
      invoiceNeeded: true
    };

    try {
      await Ticket.create(ticketData);
      // The create operation should throw an error for missing required fields
      expect.fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).to.exist;
      expect(error.name).to.equal('ValidationError');
      expect(error.errors).to.have.property('ID');
    }
  });

  // Add more test cases to cover other aspects of the model's behavior
});
