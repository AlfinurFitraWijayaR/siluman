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
