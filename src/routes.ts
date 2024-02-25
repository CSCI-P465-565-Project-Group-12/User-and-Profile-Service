import express from "express";
import { isUsernameUnique, redirect, signUp, signIn } from "./controller/index";


const router = express.Router();

// Example route setup
// router.get('/', appController.someFunction);
router.post("/signup", signUp);
router.get("/signin", signIn)
router.get("/redirect", redirect);
router.get("/isusernameunique", isUsernameUnique);

export default router;
