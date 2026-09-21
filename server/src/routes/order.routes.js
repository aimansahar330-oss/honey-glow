import { Router } from "express";

import {
  createOrder,
  deleteOrder,
  getAdminOrderById,
  getAdminOrders,
  trackOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/order.controller.js";

import upload from "../middleware/upload.middleware.js";

import {
  protectAdmin,
} from "../middleware/adminAuth.middleware.js";

const router = Router();

/* =========================
   PUBLIC
========================= */

router.post(
  "/",
  upload.single("paymentProof"),
  createOrder
);

router.get(
  "/track/:trackingNumber",
  trackOrder
);

/* =========================
   ADMIN
========================= */

router.get(
  "/admin",
  protectAdmin,
  getAdminOrders
);

router.get(
  "/admin/:id",
  protectAdmin,
  getAdminOrderById
);

router.patch(
  "/admin/:id/status",
  protectAdmin,
  updateOrderStatus
);

router.patch(
  "/admin/:id/payment",
  protectAdmin,
  updatePaymentStatus
);

router.delete(
  "/admin/:id",
  protectAdmin,
  deleteOrder
);

export default router;