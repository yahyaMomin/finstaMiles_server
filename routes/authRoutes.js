import express from "express";
import { login, register } from "../controller/auth_CTRL.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.post("/logout", logout);
// router.post("/refreshToken", generateAccessToken);

export default router;
