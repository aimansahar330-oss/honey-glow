import { Router } from "express";

import {
  deleteNotification,
  getAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notification.controller.js";

import {
  protectAdmin,
} from "../middleware/adminAuth.middleware.js";

const router = Router();

router.get(
  "/",
  protectAdmin,
  getAdminNotifications
);

router.patch(
  "/read-all",
  protectAdmin,
  markAllNotificationsRead
);

router.patch(
  "/:id/read",
  protectAdmin,
  markNotificationRead
);

router.delete(
  "/:id",
  protectAdmin,
  deleteNotification
);

export default router;