import chai from 'chai';
import sinon from 'sinon';
import Ticket from '../models/ticketModel.mjs';
import { expect } from 'chai';
import { acceptInvoice } from '../controllers/tenantController.mjs'; // Import the named export

describe('acceptInvoice', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should update ticketStatus property to Accepted', async () => {
        // Create a mock Ticket object to simulate the findOne and save methods
        const mockTicket = {
            ID: 'TEST123',
            ticketStatus: 'In Progress',
            save: sinon.stub().resolvesThis(), // Stub the save method to resolve successfully
        };

        // Create a mock request object with the TicketID parameter
        const mockRequest = {
            params: {
                TicketID: 'TEST123',
            },
        };

        // Create a mock response object to capture the response data
        const mockResponse = {
            json: sinon.spy(),
        };

        // Stub the Ticket.findOne method to return the mock ticket object
        sinon.stub(Ticket, 'findOne').resolves(mockTicket);

        // Call the function with the mock request and response objects
        await acceptInvoice(mockRequest, mockResponse);

        // Assert that the Ticket.findOne method was called with the correct TicketID
        expect(Ticket.findOne.calledOnceWith({ ID: 'TEST123' })).to.be.true;

        // Assert that the ticket.ticketStatus property was updated
        expect(mockTicket.ticketStatus).to.equal('Accepted');

        // Assert that the ticket.save method was called
        expect(mockTicket.save.calledOnce).to.be.true;

        // Assert that the response.json method was called with the correct ticket data
        expect(mockResponse.json.calledOnceWith(mockTicket)).to.be.true;
    });

    it('should return a 404 error for a non-existing ticket', async () => {
        // Create a mock request object with a non-existing TicketID
        const mockRequest = {
            params: {
                TicketID: 'NONEXISTING123',
            },
        };

        // Create a mock response object to capture the response data
        const mockResponse = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
        };

        // Stub the Ticket.findOne method to return null, simulating a non-existing ticket
        sinon.stub(Ticket, 'findOne').resolves(null);

        // Call the function with the mock request and response objects
        await acceptInvoice(mockRequest, mockResponse);

        // Assert that the Ticket.findOne method was called with the correct TicketID
        expect(Ticket.findOne.calledOnceWith({ ID: 'NONEXISTING123' })).to.be.true;

        // Assert that the response status was set to 404
        expect(mockResponse.status.calledOnceWith(404)).to.be.true;

        // Assert that the response.json method was called with the correct error message
        expect(mockResponse.json.calledOnceWith({ error: 'Ticket not found.' })).to.be.true;
    });
});
