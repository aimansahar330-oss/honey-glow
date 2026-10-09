import prisma from "../lib/prisma.js";

/* ========================================
   GET SIGNATURE PRODUCT REVIEWS
======================================== */

export const getSignatureProductReviews =
  async (req, res, next) => {
    try {
      const productId =
        Number(req.params.id);

      if (
        !Number.isInteger(productId) ||
        productId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid signature product ID.",
        });
      }

      const product =
        await prisma.signatureProduct.findUnique({
          where: {
            id: productId,
          },

          select: {
            id: true,
          },
        });

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Signature product not found.",
        });
      }

      const reviews =
        await prisma.signatureProductReview.findMany({
          where: {
            signatureProductId:
              productId,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      const reviewCount =
        reviews.length;

      const averageRating =
        reviewCount > 0
          ? reviews.reduce(
              (total, review) =>
                total +
                Number(
                  review.rating
                ),
              0
            ) / reviewCount
          : 0;

      return res.status(200).json({
        success: true,

        reviews,

        reviewCount,

        averageRating:
          Number(
            averageRating.toFixed(1)
          ),
      });
    } catch (error) {
      next(error);
    }
  };

/* ========================================
   ADD SIGNATURE PRODUCT REVIEW
======================================== */

export const addSignatureProductReview =
  async (req, res, next) => {
    try {
      const productId =
        Number(req.params.id);

      const {
        name,
        rating,
        comment,
      } = req.body;

      if (
        !Number.isInteger(productId) ||
        productId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid signature product ID.",
        });
      }

      if (!name?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Name is required.",
        });
      }

      const ratingNumber =
        Number(rating);

      if (
        !Number.isInteger(
          ratingNumber
        ) ||
        ratingNumber < 1 ||
        ratingNumber > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rating must be between 1 and 5.",
        });
      }

      if (!comment?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Review comment is required.",
        });
      }

      const product =
        await prisma.signatureProduct.findUnique({
          where: {
            id: productId,
          },

          select: {
            id: true,
            isActive: true,
          },
        });

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Signature product not found.",
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message:
            "This product is currently unavailable.",
        });
      }

      const review =
        await prisma.signatureProductReview.create({
          data: {
            name:
              name.trim(),

            rating:
              ratingNumber,

            comment:
              comment.trim(),

            signatureProductId:
              productId,
          },
        });

      const aggregate =
        await prisma.signatureProductReview.aggregate({
          where: {
            signatureProductId:
              productId,
          },

          _avg: {
            rating: true,
          },

          _count: {
            _all: true,
          },
        });

      return res.status(201).json({
        success: true,

        message:
          "Review added successfully.",

        data:
          review,

        reviewCount:
          aggregate._count._all,

        averageRating:
          Number(
            Number(
              aggregate._avg.rating ||
                0
            ).toFixed(1)
          ),
      });
    } catch (error) {
      next(error);
    }
  };