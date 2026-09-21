import slugify from "slugify";
import prisma from "../lib/prisma.js";

import {
  deleteImage,
  uploadImage,
} from "../utils/cloudinaryUpload.js";

/* PUBLIC */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/* ADMIN */
export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/* CREATE */
export const createCategory = async (req, res, next) => {
  try {
    console.log("CATEGORY BODY:", req.body);
    console.log("CATEGORY FILE:", req.file);
    const {
      name,
      shortDescription,
      displayOrder = 0,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { name: name.trim() },
          { slug },
        ],
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Category already exists.",
      });
    }

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const result = await uploadImage(
        req.file.buffer,
        "honeyglow/categories"
      );

      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        shortDescription:
          shortDescription?.trim() || null,

        imageUrl,
        imagePublicId,

        displayOrder:
          Number(displayOrder) || 0,

        isActive:
          req.body.isActive !== "false",

        isFeatured:
          req.body.isFeatured === "true",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/* UPDATE */
export const updateCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const {
      name,
      shortDescription,
      displayOrder,
      isActive,
      isFeatured,
    } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();

      updateData.slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    if (shortDescription !== undefined) {
      updateData.shortDescription =
        shortDescription?.trim() || null;
    }

    if (displayOrder !== undefined) {
      updateData.displayOrder =
        Number(displayOrder) || 0;
    }

    if (isActive !== undefined) {
      updateData.isActive =
        isActive === "true";
    }

    if (isFeatured !== undefined) {
      updateData.isFeatured =
        isFeatured === "true";
    }

    if (req.file) {
      const result = await uploadImage(
        req.file.buffer,
        "honeyglow/categories"
      );

      if (category.imagePublicId) {
        await deleteImage(category.imagePublicId);
      }

      updateData.imageUrl =
        result.secure_url;

      updateData.imagePublicId =
        result.public_id;
    }

    const updatedCategory =
      await prisma.category.update({
        where: { id },
        data: updateData,
      });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE */
export const deleteCategory = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id);

    const category =
      await prisma.category.findUnique({
        where: {
          id,
        },

        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    if (category._count.products > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This category contains products. Move or delete those products first.",
      });
    }

    if (category.imagePublicId) {
      await deleteImage(
        category.imagePublicId
      );
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};