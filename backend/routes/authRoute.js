import express from "express";
import { login, signup,logout,verifyEmail,refreshToken,forgotPassword,resetPassword,updateProfile} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login",login);
router.post("/signup",signup);
router.post("/logout",authMiddleware,logout);
router.post("/refreshToken",refreshToken);
router.post("/verifyEmail",verifyEmail);
router.post("/forgotPassword",forgotPassword);
router.post("/resetPassword",resetPassword);

router.post("/updateProfile",authMiddleware,updateProfile);
export default router;