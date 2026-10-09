import { describe, it, expect } from "vitest";
import { computeProgressUpdate } from "../src/services/progress.service";

describe("computeProgressUpdate", () => {
  it("incrementa en +1 episodio", () => {
    const result = computeProgressUpdate({
      currentProgress: 16,
      total: 24,
      delta: 1,
      currentStatus: "WATCHING",
      mediaKind: "ANIME",
    });
    expect(result.newProgress).toBe(17);
    expect(result.justCompleted).toBe(false);
  });

  it("marca como completado al alcanzar el total", () => {
    const result = computeProgressUpdate({
      currentProgress: 23,
      total: 24,
      delta: 1,
      currentStatus: "WATCHING",
      mediaKind: "ANIME",
    });
    expect(result.newProgress).toBe(24);
    expect(result.newStatus).toBe("COMPLETED");
    expect(result.justCompleted).toBe(true);
  });

  it("no supera el total aunque el delta sea mayor", () => {
    const result = computeProgressUpdate({
      currentProgress: 23,
      total: 24,
      delta: 5,
      currentStatus: "WATCHING",
      mediaKind: "ANIME",
    });
    expect(result.newProgress).toBe(24);
  });

  it("pasa de plan_to_watch a watching al registrar progreso", () => {
    const result = computeProgressUpdate({
      currentProgress: 0,
      total: 12,
      delta: 1,
      currentStatus: "PLAN_TO_WATCH",
      mediaKind: "ANIME",
    });
    expect(result.newStatus).toBe("WATCHING");
  });

  it("permite progreso manual exacto", () => {
    const result = computeProgressUpdate({
      currentProgress: 10,
      total: 120,
      manualValue: 84,
      currentStatus: "READING",
      mediaKind: "MANGA",
    });
    expect(result.newProgress).toBe(84);
    expect(result.justCompleted).toBe(false);
  });

  it("no vuelve a marcar justCompleted si ya estaba completado", () => {
    const result = computeProgressUpdate({
      currentProgress: 24,
      total: 24,
      delta: 0,
      currentStatus: "COMPLETED",
      mediaKind: "ANIME",
    });
    expect(result.justCompleted).toBe(false);
  });

  it("nunca baja de cero", () => {
    const result = computeProgressUpdate({
      currentProgress: 0,
      total: 24,
      delta: -3,
      currentStatus: "WATCHING",
      mediaKind: "ANIME",
    });
    expect(result.newProgress).toBe(0);
  });
});
