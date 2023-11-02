import "../index.css";
import moment from "moment";

const TenantTicketItem = ({
  ticket,
  setSelectedTicket,
  setIsActive,
  isActive,
  idx,
  page,
}) => {
  //FORMAT DATE
  const date = moment(ticket.datePosted).format("DD/MM/YYYY");

  const handleOnClick = () => {
    setSelectedTicket((prev) => ticket);
    setIsActive(ticket.ID);
  };
  return (
    <tr
      className={`${isActive === ticket.ID ? "active" : ""}`}
      onClick={handleOnClick}
    >
      <td>{(page - 1) * 7 + idx + 1}</td>
      <td>{ticket.ID}</td>
      <td className="listTitle">{ticket.Title}</td>
      <td>{ticket.category}</td>
      <td>{date}</td>
      <td>{ticket.ticketStatus}</td>
      <td>
        {ticket.invoiceNeeded === null
          ? "Under Review"
          : ticket.invoiceNeeded === false
          ? "Not Required"
          : ticket.acceptanceByTenant === false
          ? "Awaiting Acceptance"
          : ticket.acceptanceByTenant === true
          ? "Accepted"
          : "Error"}
      </td>
    </tr>
  );
};

export default TenantTicketItem;
