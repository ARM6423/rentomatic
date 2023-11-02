import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import TenantTicketForm from "../components/TenantTicketForm";
import userEvent from "@testing-library/user-event";

test("On create ticket form render:", () => {
  render(<TenantTicketForm />);
  const headerElement = screen.getByText(/Open a new ticket/i);
  expect(headerElement).toBeInTheDocument();
  screen.debug();
});

test("Invalid submission", async () => {
  render(<TenantTicketForm />);
  const buttonElement = screen.getByRole("button", { name: /Submit/i });
  act(() => {
    userEvent.click(buttonElement);
  });
});
