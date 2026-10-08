import slugify from "slugify";

import prisma from "../lib/prisma.js";

import {
  deleteImage,
  uploadImage,
} from "../utils/cloudinaryUpload.js";

/* ========================================
   HELPERS
======================================== */

function calculateDiscount(
  originalPrice,
  discountPrice
) {
  const original =
    Number(originalPrice);

  const discounted =
    discountPrice !== null &&
    discountPrice !== undefined
      ? Number(discountPrice)
      : null;

  if (
    !discounted ||
    discounted >= original ||
    original <= 0
  ) {
    return 0;
  }

  return Math.round(
    ((original - discounted) /
      original) *
      100
  );
}

function formatProduct(product) {
  const originalPrice =
    Number(
      product.originalPrice
    );

  const discountPrice =
    product.discountPrice !==
    null
      ? Number(
          product.discountPrice
        )
      : null;

  return {
    ...product,

    originalPrice,

    discountPrice,

    discountPercent:
      calculateDiscount(
        originalPrice,
        discountPrice
      ),
  };
}

async function createUniqueSlug(
  name,
  excludeId = null
) {
  const baseSlug =
    slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    }) || "signature-product";

  let slug =
    baseSlug;

  let counter = 2;

  while (true) {
    const existing =
      await prisma.signatureProduct.findUnique({
        where: {
          slug,
        },
      });

    if (
      !existing ||
      existing.id ===
        excludeId
    ) {
      return slug;
    }

    slug =
      `${baseSlug}-${counter}`;

    counter += 1;
  }
}

/* ========================================
   PUBLIC - ALL ACTIVE
======================================== */

export const getSignatureProducts =
  async (
    req,
    res,
    next
  ) => {
    try {
      const products =
        await prisma.signatureProduct.findMany({
          where: {
            isActive: true,
          },

          include: {
            images: {
              orderBy: {
                position:
                  "asc",
              },
            },
          },

          orderBy: [
            {
              isPrimary:
                "desc",
            },

            {
              createdAt:
                "desc",
            },
          ],
        });

      return res
        .status(200)
        .json({
          success: true,

          count:
            products.length,

          data:
            products.map(
              formatProduct
            ),
        });
    } catch (error) {
      next(error);
    }
  };

/* ========================================
   PUBLIC - PRIMARY PRODUCT
======================================== */

export const getPrimarySignatureProduct =
  async (
    req,
    res,
    next
  ) => {
    try {
      const product =
        await prisma.signatureProduct.findFirst({
          where: {
            isActive: true,
            isPrimary: true,
          },

          include: {
            images: {
              orderBy: {
                position:
                  "asc",
              },
            },
          },

          orderBy: {
            updatedAt:
              "desc",
          },
        });

      return res
        .status(200)
        .json({
          success: true,

          data: product
            ? formatProduct(
                product
              )
            : null,
        });
    } catch (error) {
      next(error);
    }
  };

/* ========================================
   PUBLIC - ONE PRODUCT
======================================== */

export const getSignatureProductBySlug =
  async (
    req,
    res,
    next
  ) => {
    try {
      const product =
        await prisma.signatureProduct.findFirst({
          where: {
            slug:
              req.params.slug,

            isActive: true,
          },

          include: {
            images: {
              orderBy: {
                position:
                  "asc",
              },
            },
          },
        });

      if (!product) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Signature product not found.",
          });
      }

      return res
        .status(200)
        .json({
          success: true,

          data:
            formatProduct(
              product
            ),
        });
    } catch (error) {
      next(error);
    }
  };

/* ========================================
   ADMIN - ALL PRODUCTS
======================================== */

export const getAdminSignatureProducts =
  async (
    req,
    res,
    next
  ) => {
    try {
      const products =
        await prisma.signatureProduct.findMany({
          include: {
            images: {
              orderBy: {
                position:
                  "asc",
              },
            },
          },

          orderBy: [
            {
              isPrimary:
                "desc",
            },

            {
              createdAt:
                "desc",
            },
          ],
        });

      return res
        .status(200)
        .json({
          success: true,

          count:
            products.length,

          data:
            products.map(
              formatProduct
            ),
        });
    } catch (error) {
      next(error);
    }
  };

/* ========================================
   CREATE SIGNATURE PRODUCT
======================================== */

export const createSignatureProduct =
  async (
    req,
    res,
    next
  ) => {
    const uploadedImages =
      [];

    try {
      const {
        name,
        shortDescription,
        originalPrice,
        discountPrice,
        stock,
        sku,
        videoUrl,
        isActive,
        isPrimary,
      } = req.body;

      if (!name?.trim()) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Product name is required.",
          });
      }

      const original =
        Number(
          originalPrice
        );

      const discounted =
        discountPrice === "" ||
        discountPrice ===
          undefined
          ? null
          : Number(
              discountPrice
            );

      if (
        !Number.isFinite(
          original
        ) ||
        original <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Original price must be greater than 0.",
          });
      }

      if (
        discounted !==
          null &&
        (
          !Number.isFinite(
            discounted
          ) ||
          discounted < 0 ||
          discounted >=
            original
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Discount price must be lower than original price.",
          });
      }

      const stockNumber =
        Number(stock);

      if (
        !Number.isInteger(
          stockNumber
        ) ||
        stockNumber < 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Stock must be 0 or greater.",
          });
      }

      if (
        !req.files?.length
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "At least one product image is required.",
          });
      }

      if (
        req.files.length >
        5
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Maximum 5 images are allowed.",
          });
      }

      if (sku?.trim()) {
        const existingSku =
          await prisma.signatureProduct.findUnique({
            where: {
              sku:
                sku.trim(),
            },
          });

        if (existingSku) {
          return res
            .status(409)
            .json({
              success: false,

              message:
                "SKU already exists.",
            });
        }
      }

      const slug =
        await createUniqueSlug(
          name.trim()
        );

      for (
        let index = 0;
        index <
        req.files.length;
        index += 1
      ) {
        const result =
          await uploadImage(
            req.files[index]
              .buffer,

            "honeyglow/signature-products"
          );

        uploadedImages.push({
          imageUrl:
            result.secure_url,

          publicId:
            result.public_id,

          position:
            index,
        });
      }

      const makePrimary =
        isPrimary ===
        "true";

      const product =
        await prisma.$transaction(
          async (tx) => {
            if (
              makePrimary
            ) {
              await tx.signatureProduct.updateMany({
                data: {
                  isPrimary:
                    false,
                },
              });
            }

            return tx.signatureProduct.create({
              data: {
                name:
                  name.trim(),

                slug,

                shortDescription:
                  shortDescription?.trim() ||
                  null,

                originalPrice:
                  original,

                discountPrice:
                  discounted,

                stock:
                  stockNumber,

                sku:
                  sku?.trim() ||
                  null,

                videoUrl:
                  videoUrl?.trim() ||
                  null,

                isActive:
                  isActive !==
                  "false",

                isPrimary:
                  makePrimary,

                images: {
                  create:
                    uploadedImages,
                },
              },

              include: {
                images: {
                  orderBy: {
                    position:
                      "asc",
                  },
                },
              },
            });
          }
        );

      return res
        .status(201)
        .json({
          success: true,

          message:
            "Signature product created successfully.",

          data:
            formatProduct(
              product
            ),
        });
    } catch (error) {
      await Promise.allSettled(
        uploadedImages.map(
          (image) =>
            deleteImage(
              image.publicId
            )
        )
      );

      next(error);
    }
  };

/* ========================================
   UPDATE SIGNATURE PRODUCT
======================================== */

export const updateSignatureProduct =
  async (
    req,
    res,
    next
  ) => {
    const uploadedImages =
      [];

    try {
      const id =
        Number(
          req.params.id
        );

      const product =
        await prisma.signatureProduct.findUnique({
          where: {
            id,
          },

          include: {
            images: true,
          },
        });

      if (!product) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Signature product not found.",
          });
      }

      const {
        name,
        shortDescription,
        originalPrice,
        discountPrice,
        stock,
        sku,
        videoUrl,
        isActive,
        isPrimary,
        removeImageIds,
      } = req.body;

      let removeIds =
        [];

      if (
        removeImageIds
      ) {
        try {
          const parsed =
            JSON.parse(
              removeImageIds
            );

          if (
            Array.isArray(
              parsed
            )
          ) {
            removeIds =
              parsed
                .map(Number)
                .filter(
                  Number.isInteger
                );
          }
        } catch {
          return res
            .status(400)
            .json({
              success:
                false,

              message:
                "Invalid image removal data.",
            });
        }
      }

      const removedImages =
        product.images.filter(
          (image) =>
            removeIds.includes(
              image.id
            )
        );

      const remainingImages =
        product.images.length -
        removedImages.length;

      const newFiles =
        req.files || [];

      if (
        remainingImages +
          newFiles.length >
        5
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Maximum 5 images are allowed.",
          });
      }

      if (
        remainingImages +
          newFiles.length <
        1
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "At least one product image is required.",
          });
      }

      const updateData =
        {};

      if (
        name !== undefined
      ) {
        if (
          !name.trim()
        ) {
          return res
            .status(400)
            .json({
              success:
                false,

              message:
                "Product name cannot be empty.",
            });
        }

        updateData.name =
          name.trim();

        updateData.slug =
          await createUniqueSlug(
            name.trim(),
            id
          );
      }

      const finalOriginal =
        originalPrice !==
        undefined
          ? Number(
              originalPrice
            )
          : Number(
              product.originalPrice
            );

      let finalDiscount =
        product.discountPrice !==
        null
          ? Number(
              product.discountPrice
            )
          : null;

      if (
        discountPrice !==
        undefined
      ) {
        finalDiscount =
          discountPrice === ""
            ? null
            : Number(
                discountPrice
              );
      }

      if (
        !Number.isFinite(
          finalOriginal
        ) ||
        finalOriginal <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Original price must be greater than 0.",
          });
      }

      if (
        finalDiscount !==
          null &&
        (
          !Number.isFinite(
            finalDiscount
          ) ||
          finalDiscount < 0 ||
          finalDiscount >=
            finalOriginal
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Discount price must be lower than original price.",
          });
      }

      if (
        originalPrice !==
        undefined
      ) {
        updateData.originalPrice =
          finalOriginal;
      }

      if (
        discountPrice !==
        undefined
      ) {
        updateData.discountPrice =
          finalDiscount;
      }

      if (
        shortDescription !==
        undefined
      ) {
        updateData.shortDescription =
          shortDescription?.trim() ||
          null;
      }

      if (
        videoUrl !==
        undefined
      ) {
        updateData.videoUrl =
          videoUrl?.trim() ||
          null;
      }

      if (
        stock !== undefined
      ) {
        const stockNumber =
          Number(stock);

        if (
          !Number.isInteger(
            stockNumber
          ) ||
          stockNumber < 0
        ) {
          return res
            .status(400)
            .json({
              success:
                false,

              message:
                "Stock must be 0 or greater.",
            });
        }

        updateData.stock =
          stockNumber;
      }

      if (
        sku !== undefined
      ) {
        const normalizedSku =
          sku?.trim() ||
          null;

        if (
          normalizedSku
        ) {
          const existingSku =
            await prisma.signatureProduct.findFirst({
              where: {
                sku:
                  normalizedSku,

                NOT: {
                  id,
                },
              },
            });

          if (
            existingSku
          ) {
            return res
              .status(409)
              .json({
                success:
                  false,

                message:
                  "SKU already exists.",
              });
          }
        }

        updateData.sku =
          normalizedSku;
      }

      if (
        isActive !==
        undefined
      ) {
        updateData.isActive =
          isActive ===
          "true";
      }

      const makePrimary =
        isPrimary ===
        "true";

      if (
        isPrimary !==
        undefined
      ) {
        updateData.isPrimary =
          makePrimary;
      }

      for (
        let index = 0;
        index <
        newFiles.length;
        index += 1
      ) {
        const result =
          await uploadImage(
            newFiles[index]
              .buffer,

            "honeyglow/signature-products"
          );

        uploadedImages.push({
          imageUrl:
            result.secure_url,

          publicId:
            result.public_id,

          position:
            remainingImages +
            index,
        });
      }

      await prisma.$transaction(
        async (tx) => {
          if (
            makePrimary
          ) {
            await tx.signatureProduct.updateMany({
              where: {
                NOT: {
                  id,
                },
              },

              data: {
                isPrimary:
                  false,
              },
            });
          }

          await tx.signatureProduct.update({
            where: {
              id,
            },

            data:
              updateData,
          });

          if (
            removeIds.length
          ) {
            await tx.signatureProductImage.deleteMany({
              where: {
                signatureProductId:
                  id,

                id: {
                  in:
                    removeIds,
                },
              },
            });
          }

          if (
            uploadedImages.length
          ) {
            await tx.signatureProductImage.createMany({
              data:
                uploadedImages.map(
                  (image) => ({
                    ...image,

                    signatureProductId:
                      id,
                  })
                ),
            });
          }
        }
      );

      await Promise.allSettled(
        removedImages.map(
          (image) =>
            deleteImage(
              image.publicId
            )
        )
      );

      const updatedProduct =
        await prisma.signatureProduct.findUnique({
          where: {
            id,
          },

          include: {
            images: {
              orderBy: {
                position:
                  "asc",
              },
            },
          },
        });

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Signature product updated successfully.",

          data:
            formatProduct(
              updatedProduct
            ),
        });
    } catch (error) {
      await Promise.allSettled(
        uploadedImages.map(
          (image) =>
            deleteImage(
              image.publicId
            )
        )
      );

      next(error);
    }
  };

/* ========================================
   DELETE SIGNATURE PRODUCT
======================================== */

export const deleteSignatureProduct =
  async (
    req,
    res,
    next
  ) => {
    try {
      const id =
        Number(
          req.params.id
        );

      const product =
        await prisma.signatureProduct.findUnique({
          where: {
            id,
          },

          include: {
            images: true,
          },
        });

      if (!product) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Signature product not found.",
          });
      }

      await prisma.signatureProduct.delete({
        where: {
          id,
        },
      });

      await Promise.allSettled(
        product.images.map(
          (image) =>
            deleteImage(
              image.publicId
            )
        )
      );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Signature product deleted successfully.",
        });
    } catch (error) {
      next(error);
    }
  };