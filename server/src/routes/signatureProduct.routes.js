import { Router } from "express";

import {
  createSignatureProduct,
  deleteSignatureProduct,
  getAdminSignatureProducts,
  getPrimarySignatureProduct,
  getSignatureProductBySlug,
  getSignatureProducts,
  updateSignatureProduct,
} from "../controllers/signatureProduct.controller.js";

import {
  addSignatureProductReview,
  getSignatureProductReviews,
} from "../controllers/signatureProductReview.controller.js";

import { protectAdmin } from "../middleware/adminAuth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

/* PUBLIC */

router.get(
  "/",
  getSignatureProducts
);

router.get(
  "/primary",
  getPrimarySignatureProduct
);

/* REVIEWS */

router.get(
  "/:id/reviews",
  getSignatureProductReviews
);

router.post(
  "/:id/reviews",
  addSignatureProductReview
);

/* ADMIN */

router.get(
  "/admin",
  protectAdmin,
  getAdminSignatureProducts
);

router.post(
  "/",
  protectAdmin,
  upload.array("images", 5),
  createSignatureProduct
);

router.put(
  "/:id",
  protectAdmin,
  upload.array("images", 5),
  updateSignatureProduct
);

router.delete(
  "/:id",
  protectAdmin,
  deleteSignatureProduct
);

/* DETAIL - KEEP LAST */

router.get(
  "/:slug",
  getSignatureProductBySlug
);

export default router;