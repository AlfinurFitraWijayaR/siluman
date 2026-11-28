import assert from "node:assert/strict";
import test from "node:test";
import { DocumentStatus, StudentStatus } from "../generated/prisma/enums";
import type {
  AgeGroupListItemDTO,
  CoachListItemDTO,
  StudentListItemDTO,
} from "../lib/services";

test("buildAdminDashboardData counts active students and verified documents once", async () => {
  const { buildAdminDashboardData } = await import(
    "../lib/dashboard/admin-dashboard"
  );

  const students = [
    {
      status: StudentStatus.AKTIF,
      ageGroup: { id: 1, name: "U-10" },
      documents: [
        { status: DocumentStatus.TERVERIFIKASI },
        { status: DocumentStatus.BELUM_LENGKAP },
      ],
    },
    {
      status: StudentStatus.AKTIF,
      ageGroup: { id: 1, name: "U-10" },
      documents: [{ status: DocumentStatus.BELUM_LENGKAP }],
    },
    {
      status: StudentStatus.NONAKTIF,
      ageGroup: { id: 2, name: "U-12" },
      documents: [{ status: DocumentStatus.TERVERIFIKASI }],
    },
    {
      status: StudentStatus.AKTIF,
      ageGroup: null,
      documents: [],
    },
  ] as unknown as StudentListItemDTO[];
  const coaches = [{}, {}] as unknown as CoachListItemDTO[];
  const ageGroups = [
    { id: 1, name: "U-10" },
    { id: 2, name: "U-12" },
    { id: 3, name: "U-14" },
  ] as unknown as AgeGroupListItemDTO[];

  const result = buildAdminDashboardData({ students, coaches, ageGroups });

  assert.equal(result.stats.activeStudents, 3);
  assert.equal(result.stats.coaches, 2);
  assert.equal(result.stats.verifiedAdministration, 2);
  assert.equal(result.stats.ageGroups, 3);
  assert.deepEqual(result.administrationDistribution, [
    { name: "Terverifikasi", value: 2 },
    { name: "Belum lengkap", value: 2 },
  ]);
});

test("buildAdminDashboardData keeps zero bars and excludes students without age group", async () => {
  const { buildAdminDashboardData } = await import(
    "../lib/dashboard/admin-dashboard"
  );

  const students = [
    {
      status: StudentStatus.AKTIF,
      ageGroup: { id: 1, name: "U-10" },
      documents: [],
    },
    {
      status: StudentStatus.AKTIF,
      ageGroup: { id: 1, name: "U-10" },
      documents: [],
    },
    {
      status: StudentStatus.NONAKTIF,
      ageGroup: { id: 2, name: "U-12" },
      documents: [],
    },
    {
      status: StudentStatus.AKTIF,
      ageGroup: null,
      documents: [],
    },
  ] as unknown as StudentListItemDTO[];
  const coaches = [] as unknown as CoachListItemDTO[];
  const ageGroups = [
    { id: 1, name: "U-10" },
    { id: 2, name: "U-12" },
    { id: 3, name: "U-14" },
  ] as unknown as AgeGroupListItemDTO[];

  const result = buildAdminDashboardData({ students, coaches, ageGroups });

  assert.deepEqual(result.ageGroupDistribution, [
    { name: "U-10", students: 2 },
    { name: "U-12", students: 0 },
    { name: "U-14", students: 0 },
  ]);
});
