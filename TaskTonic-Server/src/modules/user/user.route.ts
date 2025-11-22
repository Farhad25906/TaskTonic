
import { Router } from "express";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post("/register", UserControllers.register);
router.post("/login", UserControllers.login);
router.get("/profile", checkAuth, UserControllers.getProfile);
router.post("/refresh-token", UserControllers.refreshToken);
router.post("/logout", UserControllers.logout);

export const UserRoutes = router;
