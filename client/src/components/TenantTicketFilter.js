import { useState } from "react";
import "../pages/LandlordPage.css";
import { Button } from "react-bootstrap";

export default function TenantTicketFilter({
  pendingCount,
  inProgressCount,
  completeCount,
  setSelectedFilter,
}) {
  const [Filter, setFilter] = useState("null");

  const handleFilterClick = (filterName) => {
    // Check if the clicked filter is already active
    if (Filter === filterName) {
      // Deactivate the filter
      setFilter("null");
      setSelectedFilter("null");
    } else {
      // Activate the filter
      setFilter(filterName);
      // Apply the filter logic
      setSelectedFilter(filterName);
    }
  };
  return (
    <>
      <div className="ticket-filter-container">
        <Button
          variant={
            Filter === "Pending"
              ? "ticket-filter-container button selected"
              : "ticket-filter-container button"
          }
          onClick={() => handleFilterClick("Pending")}
          data-cy="pendingCount"
        >
          Pending: {pendingCount}
        </Button>
        <Button
          variant={
            Filter === "In Progress"
              ? "ticket-filter-container button selected"
              : "ticket-filter-container button"
          }
          onClick={() => handleFilterClick("In Progress")}
          data-cy="progressCount"
        >
          In Progress: {inProgressCount}
        </Button>

        <Button
          variant={
            Filter === "Complete"
              ? "ticket-filter-container button selected"
              : "ticket-filter-container button"
          }
          onClick={() => handleFilterClick("Complete")}
          data-cy="completeCount"
        >
          Complete: {completeCount}
        </Button>
      </div>
    </>
  );
}
