import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders the landing page", () => {
  render(<App />);
  const linkElement = screen.getByText(/RENT/i);
  expect(linkElement).toBeInTheDocument();
});
