import { DocumentStatus, StudentStatus } from "../../generated/prisma/enums";
import type {
  AgeGroupListItemDTO,
  CoachListItemDTO,
  StudentListItemDTO,
} from "../services";

export interface AdminDashboardData {
  stats: {
    activeStudents: number;
    coaches: number;
    verifiedAdministration: number;
    ageGroups: number;
  };
  ageGroupDistribution: { name: string; students: number }[];
  administrationDistribution: { name: string; value: number }[];
}

export function buildAdminDashboardData(input: {
  students: StudentListItemDTO[];
  coaches: CoachListItemDTO[];
  ageGroups: AgeGroupListItemDTO[];
}): AdminDashboardData {
  const activeStudents = input.students.filter(
    (student) => student.status === StudentStatus.AKTIF,
  );
  const verifiedAdministration = input.students.filter((student) =>
    student.documents.some(
      (document) => document.status === DocumentStatus.TERVERIFIKASI,
    ),
  ).length;

  return {
    stats: {
      activeStudents: activeStudents.length,
      coaches: input.coaches.length,
      verifiedAdministration,
      ageGroups: input.ageGroups.length,
    },
    ageGroupDistribution: input.ageGroups.map((group) => ({
      name: group.name,
      students: activeStudents.filter(
        (student) => student.ageGroup?.id === group.id,
      ).length,
    })),
    administrationDistribution: [
      { name: "Terverifikasi", value: verifiedAdministration },
      { name: "Belum lengkap", value: input.students.length - verifiedAdministration },
    ],
  };
}
