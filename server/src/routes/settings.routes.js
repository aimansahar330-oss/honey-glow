import express from "express";

import {
  getDeliverySettings,
  updateDeliverySettings,
} from "../controllers/settings.controller.js";

import {
  protectAdmin,
} from "../middleware/adminAuth.middleware.js";

const router = express.Router();

/* =====================================================
   PUBLIC
   Customer checkout bhi read kar sakega
===================================================== */

router.get(
  "/delivery",
  getDeliverySettings
);

/* =====================================================
   ADMIN ONLY
===================================================== */

router.put(
  "/delivery",
  protectAdmin,
  updateDeliverySettings
);

export default router;