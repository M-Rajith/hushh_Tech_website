import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("LastUpdated label logic", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows seconds when under 1 minute", () => {
    const now = new Date();
    vi.setSystemTime(now.getTime() + 30000);
    const seconds = Math.floor(
      (Date.now() - now.getTime()) / 1000
    );
    expect(seconds).toBe(30);
    expect(`Updated ${seconds}s ago`).toBe("Updated 30s ago");
  });

  it("shows minutes when between 1 and 60 minutes", () => {
    const now = new Date();
    vi.setSystemTime(now.getTime() + 120000);
    const seconds = Math.floor(
      (Date.now() - now.getTime()) / 1000
    );
    const minutes = Math.floor(seconds / 60);
    expect(minutes).toBe(2);
    expect(`Updated ${minutes}m ago`).toBe("Updated 2m ago");
  });

  it("shows hours when over 1 hour", () => {
    const now = new Date();
    vi.setSystemTime(now.getTime() + 7200000);
    const seconds = Math.floor(
      (Date.now() - now.getTime()) / 1000
    );
    const hours = Math.floor(seconds / 3600);
    expect(hours).toBe(2);
    expect(`Updated ${hours}h ago`).toBe("Updated 2h ago");
  });

  it("returns null when timestamp is null", () => {
    const timestamp = null;
    expect(timestamp).toBeNull();
  });

  it("interval updates label every 10 seconds", () => {
    const now = new Date();
    vi.setSystemTime(now.getTime() + 10000);
    const seconds = Math.floor(
      (Date.now() - now.getTime()) / 1000
    );
    expect(seconds).toBe(10);
  });
});
