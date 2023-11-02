import { AssertionError, assert } from 'chai';
import mongoose from 'mongoose';
import Ticket from '../models/ticketModel.mjs';

describe('Equivalence Test for Ticket feedbackRating', () => {
  before(async () => {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  after(async () => {
    // Disconnect from the MongoDB 
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clear relevant collections or reset the test database
    await Ticket.deleteMany({});
  });

  afterEach(async () => {
    // Clean up any created data
    await Ticket.deleteMany({});
  });

  it('should reject values below the valid range for feedbackRating', async () => {
    const ticket = new Ticket({
        category: 'Property Damage',
        description: 'Some description',
        Title: 'Test',
        ID: '123456',
        OP: new mongoose.Types.ObjectId(),
        ticketStatus: 'Pending',
        category: 'Property Damage',
        description: 'Some description',
        invoiceNeeded: true,
      feedbackRating: 0,
    });

    try {
      await ticket.save();
      assert.fail('Expected validation error but got none');
    } catch (error) {
      assert.isTrue(error.errors['feedbackRating'] instanceof mongoose.Error.ValidatorError);
    }
  });

  it('should accept values within the valid range for feedbackRating', async () => {
    const ticket = new Ticket({
        Title: 'Test',
        ID: '123456',
        OP: new mongoose.Types.ObjectId(),
        ticketStatus: 'Pending',
        category: 'Property Damage',
        description: 'Some description',
        invoiceNeeded: true,
        feedbackRating: 3
    });

    const savedTicket = await ticket.save();
    assert.equal(savedTicket.feedbackRating, 3);
  });

  it('should reject values above the valid range for feedbackRating', async () => {
    const ticket = new Ticket({
    ticketStatus: 'Pending',
      category: 'Property Damage',
      description: 'Some description',
      Title: 'Test',
      ID: '123456',
      OP: new mongoose.Types.ObjectId(),
      ticketStatus: 'Pending',
      category: 'Property Damage',
      description: 'Some description',
      invoiceNeeded: true,
      feedbackRating: 6,
    });

    try {
      await ticket.save();
      assert.fail('Expected validation error but got none');
    } catch (error) {
      assert.isTrue(error.errors['feedbackRating'] instanceof mongoose.Error.ValidatorError);
    }
  });

  it('should reject invalid values for feedbackRating', async () => {
    const ticket = new Ticket({
        Title: 'Test',
        ID: '123456',
        OP: new mongoose.Types.ObjectId(),
        ticketStatus: 'Pending',
        category: 'Property Damage',
        description: 'Some description',
        invoiceNeeded: true,
      feedbackRating: 'abc',
    });

    try {
      await ticket.save();
      assert.fail('Expected validation error but got none');
    } catch (error) {
        assert.isTrue(error.errors['feedbackRating'] instanceof mongoose.Error.CastError);
      
    }
  });
});
