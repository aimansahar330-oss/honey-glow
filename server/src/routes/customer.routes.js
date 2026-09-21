import { Router } from "express";

import {
  getAdminCustomers,
} from "../controllers/customer.controller.js";

import {
  protectAdmin,
} from "../middleware/adminAuth.middleware.js";

const router = Router();

router.get(
  "/admin",
  protectAdmin,
  getAdminCustomers
);

export default router;