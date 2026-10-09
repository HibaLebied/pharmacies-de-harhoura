import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { slugify } from "../lib/slugify.ts";

describe("slugify", () => {
  it("normalise les noms de pharmacies en slugs stables", () => {
    assert.equal(slugify("Pharmacie Centrale Harhoura"), "pharmacie-centrale-harhoura");
    assert.equal(slugify("Pharmacie de la Plage"), "pharmacie-de-la-plage");
  });

  it("retire les accents et les ponctuations incompatibles avec les URLs", () => {
    assert.equal(slugify("Pharmacie Santé & Bien-être"), "pharmacie-sante-bien-etre");
    assert.equal(slugify("  Pharmacie   Al-Amal !!! "), "pharmacie-al-amal");
  });
});
