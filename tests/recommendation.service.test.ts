import { describe, it, expect } from "vitest";
import {
  getFavoriteGenres,
  generateRecommendations,
  type LibraryEntryForRecs,
} from "../src/services/recommendation.service";

function entry(overrides: Partial<LibraryEntryForRecs>): LibraryEntryForRecs {
  return {
    titleId: "t1",
    title: "Sample",
    type: "ANIME",
    genres: [],
    status: "PLAN_TO_WATCH",
    rating: null,
    totalEpisodes: 12,
    totalChapters: null,
    progress: 0,
    addedAt: new Date(),
    ...overrides,
  };
}

describe("getFavoriteGenres", () => {
  it("solo considera títulos completados y puntuados", () => {
    const entries = [
      entry({ status: "WATCHING", rating: 10, genres: ["Action"] }),
      entry({ status: "COMPLETED", rating: 9, genres: ["Action", "Drama"] }),
      entry({ status: "COMPLETED", rating: 6, genres: ["Comedy"] }),
    ];
    expect(getFavoriteGenres(entries)).toEqual(["Action", "Drama"]);
  });

  it("devuelve lista vacía sin datos suficientes", () => {
    expect(getFavoriteGenres([])).toEqual([]);
  });
});

describe("generateRecommendations", () => {
  it("prioriza títulos pendientes con géneros favoritos", () => {
    const entries = [
      entry({
        titleId: "vinland",
        title: "Vinland Saga",
        status: "PLAN_TO_WATCH",
        genres: ["Action", "Drama"],
        addedAt: new Date(),
      }),
      entry({
        titleId: "random",
        title: "Random Show",
        status: "PLAN_TO_WATCH",
        genres: ["Comedy"],
        addedAt: new Date(),
      }),
      entry({
        titleId: "seed-history",
        title: "Attack on Titan",
        status: "COMPLETED",
        rating: 9,
        genres: ["Action", "Drama"],
      }),
    ];

    const recs = generateRecommendations(entries);
    expect(recs[0].titleId).toBe("vinland");
    expect(recs[0].reason).toContain("Action");
  });

  it("no recomienda nada si no hay títulos pendientes", () => {
    const entries = [entry({ status: "COMPLETED", rating: 9, genres: ["Action"] })];
    expect(generateRecommendations(entries)).toEqual([]);
  });
});
