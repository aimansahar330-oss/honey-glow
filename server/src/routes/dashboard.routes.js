import { Router } from "express";

import {
  getAdminDashboard,
} from "../controllers/dashboard.controller.js";

import {
  protectAdmin,
} from "../middleware/adminAuth.middleware.js";

const router = Router();

router.get(
  "/",
  protectAdmin,
  getAdminDashboard
);

export default router;