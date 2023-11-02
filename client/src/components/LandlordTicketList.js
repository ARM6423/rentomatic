import LandlordTicketItem from "./LandlordTicketItem";
import { Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import useTable from "../hooks/useTable";
import Pagination from "./Pagination";
import "../index.css";

const LandlordTicketList = ({
  setSelectedTicket,
  allTickets,
  isActive,
  setIsActive,
  searchValue,
  selectedFilter,
}) => {
  const [list, setList] = useState([]);
  const rowsPerPage = 7;
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(list, page, rowsPerPage);

  useEffect(() => {
    selectedFilter === "null" && searchValue.length === 0
      ? setList(
          allTickets.sort((a, b) =>
            b.ticketStatus.localeCompare(a.ticketStatus)
          )
        )
      : selectedFilter === "null" && searchValue.length > 0
      ? setList(
          allTickets
            .sort((a, b) => b.ticketStatus.localeCompare(a.ticketStatus))
            .filter(
              (item) =>
                item.category
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                item.ID.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.Title.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.datePosted.includes(searchValue) ||
                item.ticketStatus
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
            )
        )
      : selectedFilter === "Feedback"
      ? setList(
          allTickets
            .sort((a, b) => b.ticketStatus.localeCompare(a.ticketStatus))
            .filter(
              (item) =>
                item.feedbackGiven === true &&
                (item.category
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                  item.ID.toLowerCase().includes(searchValue.toLowerCase()) ||
                  item.Title.toLowerCase().includes(
                    searchValue.toLowerCase()
                  ) ||
                  item.datePosted.includes(searchValue) ||
                  item.ticketStatus
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()))
            )
        )
      : setList(
          allTickets
            .sort((a, b) => b.ticketStatus.localeCompare(a.ticketStatus))
            .filter(
              (item) =>
                item.ticketStatus === selectedFilter &&
                (item.category
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                  item.ID.toLowerCase().includes(searchValue.toLowerCase()) ||
                  item.Title.toLowerCase().includes(
                    searchValue.toLowerCase()
                  ) ||
                  item.datePosted.includes(searchValue) ||
                  item.ticketStatus
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()))
            )
        );
  }, [selectedFilter, searchValue, allTickets]);

  return (
    <>
      <Table bordered hover responsive className="list-table table-fixed">
        <thead>
          <tr>
            <th>No.</th>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Status</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {slice
            .sort((a, b) => b.ticketStatus.localeCompare(a.ticketStatus))
            .map((ticket, idx) => (
              <LandlordTicketItem
                key={ticket.ID}
                ticket={ticket}
                setSelectedTicket={setSelectedTicket}
                setIsActive={setIsActive}
                isActive={isActive}
                idx={idx}
                page={page}
              />
            ))}
        </tbody>
      </Table>
      <Pagination range={range} slice={slice} setPage={setPage} page={page} />
    </>
  );
};

//basic format for the list of tickets UI

export default LandlordTicketList;
