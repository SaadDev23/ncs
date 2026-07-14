import { Router } from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
const router = Router();

/** Import all controllers */
import * as controller from "../controllers/appController.js";

/** POST Methods */
router.route("/register").post(controller.register); // register user
// router.route('/registerMail').post((req, res) => res.json('register Mail')); // send email
router.route("/authenticate").post((req, res) => res.end()); // authenticate user
router.route("/login").post(controller.login); // login in app
router.route("/admin/login").post(controller.adminLogin); // login in app
router.route("/admin-uc").post(controller.upcomingComp); //upload Upcoming Competition
router.route("/pastpapers").post(controller.postPastPapers); //upload pp
router.route("/logout").post(controller.logout);
router.route("/me").get(controller.userSessionInfo);
router.route("/admin-onsite-competition").post(controller.onSiteCompetition);
router
  .route("/register-onsite-competition")
  .post(controller.registerForOnsiteCompetition);
router.route("/verify-email").post(controller.verifyEmail); // verify email with code
router
  .route("/resend-verification-code")
  .post(controller.resendVerificationCode); // resend verification code
router.route("/forgot-password").post(controller.forgotPassword); // request password reset
router.route("/verify-reset-code").post(controller.verifyResetCode); // verify reset code
router.route("/reset-password-with-code").post(controller.resetPassword); // reset password with code

/** GET Methods */
router.route("/user/:username").get(controller.getUser); // user with username
router.route("/generateOTP").get(controller.generateOTP); // generate random OTP
router.route("/verifyOTP").get(controller.verifyOTP); // verify generated OTP
router.route("/createResetSession").get(controller.createResetSession); // reset all the variables
router.route("/competitions").get(controller.getComp); // reset all the variables
router.route("/pastpapers").get(controller.getPastPapers); // reset all the variables
router.route("/get-onsite-competitions").get(controller.getOnsiteCompetitions); // reset all the variables
router
  .route("/onsite-competition-registrations")
  .get(controller.getOnsiteCompetitionRegistrations);

/** PUT Methods */
router.route("/updateuser").put(controller.updateUser); // used to update user profile
router.route("/resetPassword").put(controller.resetPassword); // used to reset password
router.route("/update-profile").put(controller.updateUser);
router.route("/update-profile-picture").put(controller.updateUserProfile);

/**DELETE Methods */
router.route("/pastpapers").delete(controller.deletePastPaper);
router
  .route("/delete-onsite-competition")
  .delete(controller.deleteOnSiteCompetition);

export default router;
