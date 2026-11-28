import assert from "node:assert/strict";
import test from "node:test";

test("resolveActiveAcademicYear returns the active year name", async () => {
  const { resolveActiveAcademicYear } = await import(
    "../lib/services/master-data.service"
  );

  assert.equal(
    resolveActiveAcademicYear({ name: "2025/2026" }),
    "2025/2026",
  );
});

test("resolveActiveAcademicYear returns a placeholder when no year is active", async () => {
  const { resolveActiveAcademicYear } = await import(
    "../lib/services/master-data.service"
  );

  assert.equal(resolveActiveAcademicYear(null), "-");
});
