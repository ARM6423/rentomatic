import { useState } from "react";
import "../pages/LandlordPage.css";
import { Button } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";

export default function TicketFilter({
  pendingCount,
  inProgressCount,
  completeCount,
  feedbackCount,
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
        >
          In Progress: {inProgressCount}
        </Button>
        <ButtonGroup style={{flex:"1"}}>
          <Button
            variant={
              Filter === "Complete"
                ? "ticket-filter-container button selected"
                : "ticket-filter-container button"
            }
            onClick={() => handleFilterClick("Complete")}
          >
            Complete: {completeCount}
          </Button>
          <Button
            variant={
              Filter === "Feedback"
                ? "ticket-filter-container button selected"
                : "ticket-filter-container button"
            }
            onClick={() => handleFilterClick("Feedback")}
          >
            Feedback: {feedbackCount}
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}
