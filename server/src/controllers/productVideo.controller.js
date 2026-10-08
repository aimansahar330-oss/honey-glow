import prisma from "../lib/prisma.js";

/* =========================================
   GET PUBLIC PRODUCT VIDEO
========================================= */

export const getProductVideo = async (
  req,
  res,
  next
) => {
  try {
    const productId =
      Number(req.params.productId);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id.",
      });
    }

    const video =
      await prisma.productVideo.findFirst({
        where: {
          productId,
          isActive: true,
        },
      });

    return res.status(200).json({
      success: true,
      data: video || null,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET ADMIN PRODUCT VIDEO
========================================= */

export const getAdminProductVideo = async (
  req,
  res,
  next
) => {
  try {
    const productId =
      Number(req.params.productId);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id.",
      });
    }

    const video =
      await prisma.productVideo.findUnique({
        where: {
          productId,
        },
      });

    return res.status(200).json({
      success: true,
      data: video || null,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   CREATE / UPDATE VIDEO
========================================= */

export const saveProductVideo = async (
  req,
  res,
  next
) => {
  try {
    const productId =
      Number(req.params.productId);

    const {
      videoUrl,
      isActive,
    } = req.body;

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id.",
      });
    }

    if (!videoUrl?.trim()) {
      return res.status(400).json({
        success: false,
        message: "YouTube video URL is required.",
      });
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const video =
      await prisma.productVideo.upsert({
        where: {
          productId,
        },

        update: {
          videoUrl:
            videoUrl.trim(),

          isActive:
            isActive !== false,
        },

        create: {
          productId,

          videoUrl:
            videoUrl.trim(),

          isActive:
            isActive !== false,
        },
      });

    return res.status(200).json({
      success: true,
      message: "Product video saved successfully.",
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   DELETE VIDEO
========================================= */

export const deleteProductVideo = async (
  req,
  res,
  next
) => {
  try {
    const productId =
      Number(req.params.productId);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id.",
      });
    }

    const video =
      await prisma.productVideo.findUnique({
        where: {
          productId,
        },
      });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Product video not found.",
      });
    }

    await prisma.productVideo.delete({
      where: {
        productId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product video deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};