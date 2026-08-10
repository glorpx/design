import { describe, it, expect } from "vitest";
import { version } from "../src/index";

describe("@glorpx/design", () => {
  it("exports version", () => {
    expect(version).toBe("0.1.0");
  });

  it("basic sanity check", () => {
    expect(true).toBe(true);
  });
});
