// test/pages/index.test.js
import { act, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

import Index from "../../../src/pages/index";

describe("Index", () => {
  it("should render the heading", () => {
    render(<Index />);

    const heading = screen.getByText(/Upload documents/i);

    expect(heading).toBeInTheDocument();
    expect(heading).toMatchSnapshot();
  });

  it("should pass accessibility scan", async () => {
    const { container } = render(<Index />);
    await act(async () => {
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
