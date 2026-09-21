import slugify from "slugify";

import prisma from "../lib/prisma.js";

import {
  deleteImage,
  uploadImage,
} from "../utils/cloudinaryUpload.js";

function calculateDiscount(originalPrice, discountPrice) {
  const original = Number(originalPrice);
  const discounted =
    discountPrice !== null && discountPrice !== undefined
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
    ((original - discounted) / original) * 100
  );
}
function formatProduct(product) {
  const originalPrice = Number(product.originalPrice);

  const discountPrice =
    product.discountPrice !== null
      ? Number(product.discountPrice)
      : null;

  const reviews = Array.isArray(product.reviews)
    ? product.reviews
    : [];

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) =>
            total + review.rating,
          0
        ) / reviews.length
      : 0;

  return {
    ...product,

    originalPrice,
    discountPrice,

    discountPercent: calculateDiscount(
      originalPrice,
      discountPrice
    ),

    averageRating: Number(
      averageRating.toFixed(1)
    ),

    reviewCount: reviews.length,
  };
}

async function createUniqueSlug(name, excludeId = null) {
  const baseSlug =
    slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    }) || "product";

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (!existing || existing.id === excludeId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

/* ========================================
   PUBLIC PRODUCTS
======================================== */

export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      featured,
      search,
    } = req.query;

    const where = {
      isActive: true,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (search?.trim()) {
      where.name = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    const products = await prisma.product.findMany({
      where,

      include: {
        category: true,

        images: {
          orderBy: {
            position: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products.map(formatProduct),
    });
  } catch (error) {
    next(error);
  }
};

/* ========================================
   FEATURED PRODUCTS
======================================== */

export const getFeaturedProducts = async (
  req,
  res,
  next
) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },

      include: {
        category: true,

        images: {
          orderBy: {
            position: "asc",
          },
        },
        reviews: {
    orderBy: {
      createdAt: "desc",
    },
  },
},
      

      orderBy: {
        createdAt: "desc",
      },

      take: 15,
    });

    return res.status(200).json({
      success: true,
      data: products.map(formatProduct),
    });
  } catch (error) {
    next(error);
  }
};

/* ========================================
   PRODUCT DETAIL
======================================== */

export const getProductBySlug = async (
  req,
  res,
  next
) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug: req.params.slug,
        isActive: true,
      },

      include: {
        category: true,

        images: {
          orderBy: {
            position: "asc",
          },
        },
         reviews: {
    orderBy: {
      createdAt: "desc",
    },
  },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: formatProduct(product),
    });
  } catch (error) {
    next(error);
  }
};

/* ========================================
   ADMIN PRODUCTS
======================================== */

export const getAdminProducts = async (
  req,
  res,
  next
) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,

        images: {
          orderBy: {
            position: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products.map(formatProduct),
    });
  } catch (error) {
    next(error);
  }
};

/* ========================================
   CREATE PRODUCT
======================================== */

export const createProduct = async (
  req,
  res,
  next
) => {
  const uploadedImages = [];

  try {
    const {
      name,
      shortDescription,
      originalPrice,
      discountPrice,
      stock,
      sku,
      categoryId,
      isActive,
      isFeatured,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    const original = Number(originalPrice);

    const discounted =
      discountPrice === "" ||
      discountPrice === undefined
        ? null
        : Number(discountPrice);

    if (
      !Number.isFinite(original) ||
      original <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Original price must be greater than 0.",
      });
    }

    if (
      discounted !== null &&
      (
        !Number.isFinite(discounted) ||
        discounted < 0 ||
        discounted >= original
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Discount price must be lower than original price.",
      });
    }

    const stockNumber = Number(stock);

    if (
      !Number.isInteger(stockNumber) ||
      stockNumber < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock must be 0 or greater.",
      });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Selected category does not exist.",
      });
    }

    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required.",
      });
    }

    if (req.files.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 product images are allowed.",
      });
    }

    if (sku?.trim()) {
      const existingSku = await prisma.product.findUnique({
        where: {
          sku: sku.trim(),
        },
      });

      if (existingSku) {
        return res.status(409).json({
          success: false,
          message: "SKU already exists.",
        });
      }
    }

    const slug = await createUniqueSlug(name.trim());

    for (let index = 0; index < req.files.length; index += 1) {
      const result = await uploadImage(
        req.files[index].buffer,
        "honeyglow/products"
      );

      uploadedImages.push({
        imageUrl: result.secure_url,
        publicId: result.public_id,
        position: index,
      });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        shortDescription:
          shortDescription?.trim() || null,

        originalPrice: original,
        discountPrice: discounted,

        stock: stockNumber,
        sku: sku?.trim() || null,

        categoryId: Number(categoryId),

        isActive: isActive !== "false",
        isFeatured: isFeatured === "true",

        images: {
          create: uploadedImages,
        },
      },

      include: {
        category: true,

        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: formatProduct(product),
    });
  } catch (error) {
    for (const image of uploadedImages) {
      try {
        await deleteImage(image.publicId);
      } catch {
        // cleanup failure should not hide original error
      }
    }

    next(error);
  }
};

/* ========================================
   UPDATE PRODUCT
======================================== */

export const updateProduct = async (
  req,
  res,
  next
) => {
  const uploadedImages = [];

  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        images: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const {
      name,
      shortDescription,
      originalPrice,
      discountPrice,
      stock,
      sku,
      categoryId,
      isActive,
      isFeatured,
      removeImageIds,
    } = req.body;

    let removeIds = [];

    if (removeImageIds) {
      try {
        const parsed = JSON.parse(removeImageIds);

        if (Array.isArray(parsed)) {
          removeIds = parsed
            .map(Number)
            .filter(Number.isInteger);
        }
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid removed image data.",
        });
      }
    }

    const removedImages = product.images.filter(
      (image) =>
        removeIds.includes(image.id)
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
      return res.status(400).json({
        success: false,
        message: "Maximum 5 product images are allowed.",
      });
    }

    if (
      remainingImages +
        newFiles.length <
      1
    ) {
      return res.status(400).json({
        success: false,
        message: "Product must have at least one image.",
      });
    }

    const updateData = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty.",
        });
      }

      updateData.name = name.trim();

      updateData.slug =
        await createUniqueSlug(
          name.trim(),
          id
        );
    }

    const finalOriginal =
      originalPrice !== undefined
        ? Number(originalPrice)
        : Number(product.originalPrice);

    let finalDiscount =
      product.discountPrice !== null
        ? Number(product.discountPrice)
        : null;

    if (discountPrice !== undefined) {
      finalDiscount =
        discountPrice === ""
          ? null
          : Number(discountPrice);
    }

    if (
      !Number.isFinite(finalOriginal) ||
      finalOriginal <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Original price must be greater than 0.",
      });
    }

    if (
      finalDiscount !== null &&
      (
        !Number.isFinite(finalDiscount) ||
        finalDiscount < 0 ||
        finalDiscount >= finalOriginal
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Discount price must be lower than original price.",
      });
    }

    if (originalPrice !== undefined) {
      updateData.originalPrice =
        finalOriginal;
    }

    if (discountPrice !== undefined) {
      updateData.discountPrice =
        finalDiscount;
    }

    if (shortDescription !== undefined) {
      updateData.shortDescription =
        shortDescription?.trim() || null;
    }

    if (stock !== undefined) {
      const stockNumber = Number(stock);

      if (
        !Number.isInteger(stockNumber) ||
        stockNumber < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Stock must be 0 or greater.",
        });
      }

      updateData.stock = stockNumber;
    }

    if (sku !== undefined) {
      const normalizedSku =
        sku?.trim() || null;

      if (normalizedSku) {
        const existingSku =
          await prisma.product.findFirst({
            where: {
              sku: normalizedSku,

              NOT: {
                id,
              },
            },
          });

        if (existingSku) {
          return res.status(409).json({
            success: false,
            message: "SKU already exists.",
          });
        }
      }

      updateData.sku = normalizedSku;
    }

    if (categoryId !== undefined) {
      const category =
        await prisma.category.findUnique({
          where: {
            id: Number(categoryId),
          },
        });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Selected category does not exist.",
        });
      }

      updateData.categoryId =
        Number(categoryId);
    }

    if (isActive !== undefined) {
      updateData.isActive =
        isActive === "true";
    }

    if (isFeatured !== undefined) {
      updateData.isFeatured =
        isFeatured === "true";
    }

    for (
      let index = 0;
      index < newFiles.length;
      index += 1
    ) {
      const result = await uploadImage(
        newFiles[index].buffer,
        "honeyglow/products"
      );

      uploadedImages.push({
        imageUrl: result.secure_url,
        publicId: result.public_id,
        position:
          remainingImages + index,
      });
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.product.update({
          where: {
            id,
          },

          data: updateData,
        });

        if (removeIds.length) {
          await tx.productImage.deleteMany({
            where: {
              productId: id,

              id: {
                in: removeIds,
              },
            },
          });
        }

        if (uploadedImages.length) {
          await tx.productImage.createMany({
            data: uploadedImages.map(
              (image) => ({
                ...image,
                productId: id,
              })
            ),
          });
        }
      }
    );

    await Promise.allSettled(
      removedImages.map((image) =>
        deleteImage(image.publicId)
      )
    );

    const updatedProduct =
      await prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          category: true,

          images: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: formatProduct(updatedProduct),
    });
  } catch (error) {
    await Promise.allSettled(
      uploadedImages.map((image) =>
        deleteImage(image.publicId)
      )
    );

    next(error);
  }
};

/* ========================================
   DELETE PRODUCT
======================================== */

export const deleteProduct = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id);

    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          images: true,
        },
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    await Promise.allSettled(
      product.images.map((image) =>
        deleteImage(image.publicId)
      )
    );

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const addProductReview = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    const {
      name,
      rating,
      comment,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    const ratingNumber = Number(rating);

    if (
      !Number.isInteger(ratingNumber) ||
      ratingNumber < 1 ||
      ratingNumber > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    if (!comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review comment is required.",
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const review = await prisma.productReview.create({
      data: {
        name: name.trim(),
        rating: ratingNumber,
        comment: comment.trim(),
        productId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully.",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};