import express from "express";
import {
  isUsernameUnique,
  redirect,
  signUp,
  signIn,
  sendOTP,
  verifyOTP,
  resetPassword,
  createUserProfile,
  updateUserProfile,
  getCurrentUser,
  getCurrentUserProfile,
} from "./controller/index";
import { validateUserToken } from "./middleware/auth";

const router = express.Router();

// Example route setup
// router.get('/', appController.someFunction);
router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/redirect", redirect);
router.get("/isusernameunique", isUsernameUnique);
router.get("/sendotp", sendOTP);
router.get("/verifyotp", verifyOTP);
router.post("/resetpassword", validateUserToken, resetPassword);
router.post("/createprofile", validateUserToken, createUserProfile);
router.post("/updateprofile", validateUserToken, updateUserProfile);
router.get("/currentuser", validateUserToken, getCurrentUser);
router.get("/profile", validateUserToken, getCurrentUserProfile)

export default router;
