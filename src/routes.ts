import express from "express";
import { isUsernameUnique, redirect, signUp, signIn, sendOTP, verifyOTP, resetPassword } from "./controller/index";


const router = express.Router();

// Example route setup
// router.get('/', appController.someFunction);
router.post("/signup", signUp);
router.get("/signin", signIn)
router.get("/redirect", redirect);
router.get("/isusernameunique", isUsernameUnique);
router.get("/sendotp",sendOTP);
router.get("/verifyotp",verifyOTP);
router.post("/resetpassword",resetPassword);

export default router;
