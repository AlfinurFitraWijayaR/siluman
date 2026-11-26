import { AuthService } from "./services/auth.service";
import { MasterDataService } from "./services/master-data.service";
import { Role } from "../generated/prisma/enums";

export interface AppLayoutData {
  user: {
    id: number;
    username: string;
    name: string;
    role: Role;
    roleLabel: string;
    profilePhoto?: string | null;
  };
  academicYear: string;
}

export async function getLayoutData(): Promise<AppLayoutData> {
  const user = await AuthService.getCurrentUser();
  const academicYear = await MasterDataService.getActiveAcademicYear();

  const role = user?.role || Role.ADMINISTRATOR;
  const roleLabel =
    role === Role.ADMINISTRATOR ? "Administrator" : "Pelatih SSB";

  return {
    user: {
      id: user?.id || 0,
      username: user?.username || "User",
      name: user?.username || "User",
      role,
      roleLabel,
      profilePhoto: null,
    },
    academicYear,
  };
}
