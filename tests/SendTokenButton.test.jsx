// cf-frontend/__tests__/SendTokenButton.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SendTokenButton from "../src/components/SendTokenButton";

// Mock the Clerk useAuth hook
jest.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({
    getToken: jest.fn().mockResolvedValue("mocked-jwt-token"),
  }),
}));

describe("SendTokenButton", () => {
  beforeEach(() => {
    // mock global fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true, clerkUserId: "user_abc_123" }),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("calls getToken and sends Authorization header to the backend", async () => {
    render(<SendTokenButton />);

    const btn = screen.getByRole("button", { name: /send token/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Inspect fetch call
    const [[url, opts]] = global.fetch.mock.calls;
    expect(url).toMatch(/\/api\/proxy\/api\/auth\/verify-and-store|\/api\/auth\/verify-and-store/);
    expect(opts.headers.Authorization).toBe("Bearer mocked-jwt-token");
    expect(opts.method).toBe("POST");
  });
});
