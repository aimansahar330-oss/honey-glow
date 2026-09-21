import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getFeaturedProducts,
  getProductBySlug,
  getProducts,
  updateProduct,
  addProductReview,
} from "../controllers/product.controller.js";

import { protectAdmin } from "../middleware/adminAuth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

/* PUBLIC */
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);

/* ADMIN */
router.get("/admin", protectAdmin, getAdminProducts);

router.post(
  "/:id/reviews",
  addProductReview
);

router.post(
  "/",
  protectAdmin,
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  protectAdmin,
  upload.array("images", 5),
  updateProduct
);

router.delete(
  "/:id",
  protectAdmin,
  deleteProduct
);

/* PRODUCT DETAIL - KEEP LAST */
router.get("/:slug", getProductBySlug);

export default router;