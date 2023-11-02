import React from "react";

const TicketItem = ({ ticket }) => {
  return (
    <tr>
      <td>{ticket.description}</td>
      <td>{ticket.category}</td>
      <td>{ticket.date}</td>
      <td>{ticket.progress}</td>
    </tr>
  );
};

export default TicketItem;
