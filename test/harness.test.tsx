import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

/**
 * Harness tests verify the jsdom + testing-library setup works
 * These tests ensure the test environment can render React components
 */

describe("Testing Library Harness", () => {
  it("renders a simple DOM element in jsdom", () => {
    const { container } = render(<div data-testid="test-div">Hello</div>);
    expect(container).toBeInTheDocument();
  });

  it("can query rendered elements using testing-library", () => {
    const { getByTestId } = render(<div data-testid="harness-element">Test</div>);
    const element = getByTestId("harness-element");
    expect(element).toBeInTheDocument();
    expect(element.textContent).toBe("Test");
  });

  it("supports jest-dom matchers", () => {
    const { getByTestId } = render(
      <button data-testid="test-button" disabled>
        Click
      </button>
    );
    const button = getByTestId("test-button");
    expect(button).toBeDisabled();
  });
});
