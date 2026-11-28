export {
  loginAction,
  logoutAction,
  type LoginActionResult,
} from "../controllers/auth.controller";

export {
  createStudentAction,
  updateStudentAction,
  deleteStudentAction,
  verifyStudentDocumentsAction,
  getNextNISAction,
  type StudentActionResult,
} from "../controllers/student.controller";

export {
  createCoachAction,
  updateCoachAction,
  deleteCoachAction,
  type CoachActionResult,
} from "../controllers/coach.controller";

export {
  createAgeGroupAction,
  updateAgeGroupAction,
  deleteAgeGroupAction,
  type AgeGroupActionResult,
} from "../controllers/age-group.controller";

export {
  createAcademicYearAction,
  updateAcademicYearAction,
  deleteAcademicYearAction,
  type AcademicYearActionResult,
} from "../controllers/academic-year.controller";

