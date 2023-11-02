import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import TenantTicketFilter from "../components/TenantTicketFilter";
import "./LandlordPage.css";
import { Button } from "react-bootstrap";
import TenantProgressForm from "../components/TenantProgressForm";
import TenantTicketList from "../components/TenantTicketList";
import TenantPendingForm from "../components/TenantPendingForm";
import TenantCompleteForm from "../components/TenantCompleteForm";
import TenantTicketForm from "../components/TenantTicketForm";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FeedbackForm from "../components/FeedbackForm";
import "../index.css";
import axios from "axios";

export default function TenantPage({ setToken }) {
  const [selectedFilter, setSelectedFilter] = useState("null");
  //TODO: useEffect and set listTickets as total tickets in table (only update when api change).
  const [listTickets, setListTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [isActive, setIsActive] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [tenant, setTenant] = useState(null);



  useEffect(() => {
   
    const userToken = JSON.parse(localStorage.getItem('user'));
    
    const config = {
      'headers':{'authorization': `Bearer ${userToken.token}`}
    }
    axios
      .get("http://localhost:5050/api/tenant/tickets/all/" + userToken.id,config)
      .then((res) => {
        setTenant(userToken);
        setListTickets(res.data);
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
    if (selectedTicket === "New" || selectedTicket === "") {
      setIsActive((prev) => null);
    }
  }, [selectedTicket]);

  useEffect(() => {
    const pending = listTickets.filter((ticket) => {
      return ticket.ticketStatus === "Pending";
    }).length;
    setPendingCount(pending);
    const progress = listTickets.filter((ticket) => {
      return ticket.ticketStatus === "In Progress";
    }).length;
    setInProgressCount(progress);
    const complete = listTickets.filter((ticket) => {
      return ticket.ticketStatus === "Complete";
    }).length;
    setCompleteCount(complete);
  }, [listTickets]);

  const handleRefresh = () => {
    window.location.reload();
    return;
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleCreateTicket = () => {
    setSelectedTicket("New");
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="overlay_hidden">
        <Header></Header>
        <NavBar setToken={setToken} tab="Dashboard" parent="tenant"></NavBar>
        <div className="body">
          <FeedbackForm
            show={showModal}
            handleClose={handleClose}
            ID={selectedTicket.ID}
            setListTickets={setListTickets}
            selectedTicket={selectedTicket}
            setSelectedTicket={setSelectedTicket}
          />

          <div className="tenant-left-container">
            <TenantTicketFilter
              pendingCount={pendingCount}
              inProgressCount={inProgressCount}
              completeCount={completeCount}
              setSelectedFilter={setSelectedFilter}
            ></TenantTicketFilter>
            <div className="tenant-right-container-buttons">
              <div>
                <Button
                  variant="button"
                  className="refreshButton"
                  onClick={() => handleRefresh()}
                >
                  Refresh
                </Button>
              </div>
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
              <TenantTicketList
                setSelectedTicket={setSelectedTicket}
                listTickets={listTickets}
                isActive={isActive}
                setIsActive={setIsActive}
                selectedFilter={selectedFilter}
                searchValue={searchValue}
              ></TenantTicketList>
            </div>
          </div>
          <div className="tenant-right-container">
            <div className="tenant-right-ticket-buttons">
              <div>
                <Button
                  variant="button"
                  className="text-nowrap create-ticket-button"
                  onClick={() => handleCreateTicket()}
                >
                  Create Ticket
                </Button>
              </div>
            </div>
            <div className="tenant right-container-details">
              {selectedTicket === "" ? (
                <></>
              ) : selectedTicket === "New" ? (
                <TenantTicketForm
                  tenantID={tenant.id}
                  email={tenant.email}
                  setSelectedTicket={setSelectedTicket}
                  setListTickets={setListTickets}
                />
              ) : selectedTicket.ticketStatus === "Pending" ? (
                <TenantPendingForm
                  setSelectedTicket={setSelectedTicket}
                  selectedTicket={selectedTicket}
                  tenantID={tenant.email}
                />
              ) : selectedTicket.ticketStatus === "In Progress" ? (
                <TenantProgressForm
                  setSelectedTicket={setSelectedTicket}
                  selectedTicket={selectedTicket}
                  tenantID={tenant.email}
                  setListTickets={setListTickets}
                />
              ) : selectedTicket.ticketStatus === "Complete" ? (
                <TenantCompleteForm
                  selectedTicket={selectedTicket}
                  onSubmitFeedback={handleShow}
                  setSelectedTicket={setSelectedTicket}
                  tenantID={tenant.email}
                />
              ) : (
                <>Error</>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
