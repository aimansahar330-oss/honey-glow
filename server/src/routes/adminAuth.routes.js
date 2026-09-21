import { Router } from "express";

import {
  adminLogin,
  getAdminProfile,
} from "../controllers/adminAuth.controller.js";

import { protectAdmin } from "../middleware/adminAuth.middleware.js";

const router = Router();

router.post("/login", adminLogin);
router.get("/me", protectAdmin, getAdminProfile);

export default router;