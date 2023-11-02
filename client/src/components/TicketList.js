import React, { useState } from "react";
import TicketItem from "./TicketItem";

const TicketList = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      completed: false,
      category: "Category 1",
      description: "Ticket 1 description",
      date: "2023-06-30",
      progress: "Pending",
    },
    // Add more tickets as needed
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  return (
    <table className="ticket-list">
      <thead>
        <tr>
          <th>Description</th>
          <th>Category</th>
          <th>Date</th>
          <th>Progress</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))}
      </tbody>
    </table>
  );
};

//basic format for the list of tickets UI

export default TicketList;
