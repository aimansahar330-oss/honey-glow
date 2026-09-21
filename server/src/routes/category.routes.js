import { Router } from "express";

import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";

import { protectAdmin } from "../middleware/adminAuth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

/* PUBLIC */
router.get("/", getCategories);

/* ADMIN */
router.get(
  "/admin",
  protectAdmin,
  getAdminCategories
);

router.post(
  "/",
  protectAdmin,
  upload.single("image"),
  createCategory
);

router.put(
  "/:id",
  protectAdmin,
  upload.single("image"),
  updateCategory
);

router.delete(
  "/:id",
  protectAdmin,
  deleteCategory
);

export default router;