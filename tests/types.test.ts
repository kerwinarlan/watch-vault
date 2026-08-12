import { test } from "node:test";
import assert from "node:assert/strict";
import { collectionMatches } from "../lib/types.ts";

test("collectionMatches maps conditions to The Watch Alley categories", () => {
  assert.equal(collectionMatches("Brand New", "New"), true);
  assert.equal(collectionMatches("Brand New", "Pre-owned"), false);
  assert.equal(collectionMatches("Pre-owned", "Pre-owned"), true);
  assert.equal(collectionMatches("Pre-owned", "Mint"), true);
  assert.equal(collectionMatches("Pre-owned", "New"), false);
  assert.equal(collectionMatches("Limited Edition", "New"), false);
  assert.equal(collectionMatches("Limited Edition", "Pre-owned"), false);
});
