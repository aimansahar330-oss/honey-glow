import {
  Router,
} from "express";

import {
  deleteProductVideo,
  getAdminProductVideo,
  getProductVideo,
  saveProductVideo,
} from "../controllers/productVideo.controller.js";

import {
  protectAdmin,
} from "../middleware/adminAuth.middleware.js";

const router = Router();

/* PUBLIC */

router.get(
  "/:productId",
  getProductVideo
);

/* ADMIN */

router.get(
  "/admin/:productId",
  protectAdmin,
  getAdminProductVideo
);

router.put(
  "/admin/:productId",
  protectAdmin,
  saveProductVideo
);

router.delete(
  "/admin/:productId",
  protectAdmin,
  deleteProductVideo
);

export default router;