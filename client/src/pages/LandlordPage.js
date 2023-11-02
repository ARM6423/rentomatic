import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { Button } from "react-bootstrap";
import "./LandlordPage.css";
import TicketFilter from "../components/TicketFilter";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import LandlordPendingForm from "../components/LandlordPendingForm";
import LandlordProgressForm from "../components/LandlordProgressForm";
import LandlordCompleteForm from "../components/LandlordCompleteForm";
import LandlordTicketList from "../components/LandlordTicketList";
import axios from "axios";

const LandlordPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("null");
  const [allTickets, setAllTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [isActive, setIsActive] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [landlord, setLandlord] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const userToken = JSON.parse(localStorage.getItem("user"));
    const config = {
      'headers':{'authorization': `Bearer ${userToken.token}`}
    }
    axios
      .get("http://localhost:5050/api/landlord/tickets/all/" + userToken.id,config)
      .then((res) => {
        setLandlord(userToken);
        setAllTickets(res.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedTicket === "") {
      setIsActive((prev) => null);
    }
  }, [selectedTicket]);

  useEffect(() => {
    //TODO: Replace Tickets with total ticket array that does not get modified
    const pending = allTickets.filter((ticket) => {
      return ticket.ticketStatus === "Pending";
    }).length;
    setPendingCount(pending);
    const progress = allTickets.filter((ticket) => {
      return ticket.ticketStatus === "In Progress";
    }).length;
    setInProgressCount(progress);
    const complete = allTickets.filter((ticket) => {
      return ticket.ticketStatus === "Complete";
    }).length;
    setCompleteCount(complete);

    const feedback = allTickets.filter((ticket) => {
      return ticket.feedbackGiven === true;
    }).length;
    setFeedbackCount(feedback);
  }, [allTickets]);

  // Section ends
  const handleRefresh = () => {
    window.location.reload();
    return;
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    return;
  };

  return (
    <>
      <Header></Header>
      <NavBar setToken={setLandlord} tab="Dashboard" parent="landlord"></NavBar>
      <div className="body">
        <div className="tenant-left-container">
          <TicketFilter
            pendingCount={pendingCount}
            inProgressCount={inProgressCount}
            completeCount={completeCount}
            feedbackCount={feedbackCount}
            setSelectedFilter={setSelectedFilter}
            feedback
          ></TicketFilter>
          <div className="tenant-right-container-buttons">
            <Button variant="button" onClick={() => handleRefresh()}>
              Refresh
            </Button>
            <InputGroup size="sm">
              <InputGroup.Text>Search</InputGroup.Text>
              <Form.Control
                value={searchValue}
                onChange={handleSearch}
                placeholder="Filter"
              />
            </InputGroup>
          </div>
          <div className="ticket-list-container">
            <LandlordTicketList
              setSelectedTicket={setSelectedTicket}
              allTickets={allTickets}
              isActive={isActive}
              setIsActive={setIsActive}
              selectedFilter={selectedFilter}
              searchValue={searchValue}
            ></LandlordTicketList>
          </div>
        </div>
        <div className="tenant-right-container">
          <div className="tenant right-container-details">
            {selectedTicket === "" ? (
              <></>
            ) : selectedTicket.ticketStatus === "Pending" ? (
              <LandlordPendingForm
                setAllTickets={setAllTickets}
                selectedTicket={selectedTicket}
                setSelectedTicket={setSelectedTicket}
              />
            ) : selectedTicket.ticketStatus === "In Progress" ? (
              <LandlordProgressForm
                selectedTicket={selectedTicket}
                setAllTickets={setAllTickets}
                setSelectedTicket={setSelectedTicket}
              />
            ) : selectedTicket.ticketStatus === "Complete" ? (
              <LandlordCompleteForm selectedTicket={selectedTicket} />
            ) : (
              <>Error</>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LandlordPage;
