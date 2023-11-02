import TenantTicketItem from "./TenantTicketItem";
import { Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import useTable from "../hooks/useTable";
import Pagination from "./Pagination";
import "../index.css";

export default function TenantTicketList({
  setSelectedTicket,
  isActive,
  setIsActive,
  listTickets,
  selectedFilter,
  searchValue,
}) {
  const [list, setList] = useState([]);

  //Set number of rows per page for table
  const rowsPerPage = 7;
  //FILTER BUTTONS
  useEffect(() => {
    selectedFilter === "null" && searchValue.length === 0
      ? setList(
          listTickets.sort((a, b) =>
            b.ticketStatus.localeCompare(a.ticketStatus)
          )
        )
      : selectedFilter === "null" && searchValue.length > 0
      ? setList(
          listTickets
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
      : setList(
          listTickets
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
  }, [selectedFilter, searchValue, listTickets]);

  const [page, setPage] = useState(1);
  const { slice, range } = useTable(list, page, rowsPerPage);

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
        <tbody data-cy="datatable">
          {slice.map((ticket, idx) => (
            <TenantTicketItem
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
}
