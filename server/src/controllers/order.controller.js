import crypto from "crypto";
import prisma from "../lib/prisma.js";
import {
  deleteImage,
  uploadImage,
} from "../utils/cloudinaryUpload.js";

/* =========================================
   TRACKING NUMBER
========================================= */

function createTrackingNumber() {
  const time = Date.now()
    .toString()
    .slice(-8);

  const random = crypto
    .randomBytes(2)
    .toString("hex")
    .toUpperCase();

  return `KM-${time}-${random}`;
}

/* =========================================
   PRODUCT TYPE
========================================= */

function normalizeProductType(type) {
  return type === "SIGNATURE"
    ? "SIGNATURE"
    : "REGULAR";
}

/* =========================================
   CREATE GUEST ORDER
========================================= */

export const createOrder = async (
  req,
  res,
  next
) => {
  let uploadedPaymentProof = null;

  try {
    const {
      customerName,
      phone,
      email,
      address,
      city,
      notes,
      paymentMethod = "COD",
      paymentSenderNumber,
      paymentReference,
    } = req.body;

    let items = req.body.items;

    /* =====================================
       PARSE CART ITEMS
    ===================================== */

    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid cart data.",
        });
      }
    }

    /* =====================================
       BASIC VALIDATION
    ===================================== */

    if (!customerName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    if (!address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required.",
      });
    }

    if (!city?.trim()) {
      return res.status(400).json({
        success: false,
        message: "City is required.",
      });
    }

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    /* =====================================
       PAYMENT METHOD
    ===================================== */

    const allowedPaymentMethods = [
      "COD",
      "JAZZCASH",
      "EASYPAISA",
    ];

    if (
      !allowedPaymentMethods.includes(
        paymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
      });
    }

    const walletPayment =
      paymentMethod === "JAZZCASH" ||
      paymentMethod === "EASYPAISA";

    /* =====================================
       WALLET PAYMENT VALIDATION
    ===================================== */

    if (walletPayment) {
      if (
        !paymentSenderNumber?.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment sender number is required.",
        });
      }

      if (
        !paymentReference?.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Transaction ID is required.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Payment screenshot is required.",
        });
      }

      /* DUPLICATE TRANSACTION */

      const existingReference =
        await prisma.order.findUnique({
          where: {
            paymentReference:
              paymentReference.trim(),
          },
        });

      if (existingReference) {
        return res.status(409).json({
          success: false,
          message:
            "This transaction ID has already been used.",
        });
      }

      /* =====================================
         CLOUDINARY UPLOAD
         TRANSACTION KE BAHAR
      ===================================== */

      const uploadResult =
        await uploadImage(
          req.file.buffer,
          "km-cares/payments"
        );

      uploadedPaymentProof = {
        url:
          uploadResult.secure_url,

        publicId:
          uploadResult.public_id,
      };
    }

    /* =====================================
       NORMALIZE + MERGE CART ITEMS

       REGULAR-1 aur SIGNATURE-1
       dono separate rahenge.
    ===================================== */

    const itemMap = new Map();

    for (const item of items) {
      const productType =
        normalizeProductType(
          item.productType
        );

      const rawId =
        productType === "SIGNATURE"
          ? (
              item.signatureProductId ??
              item.productId ??
              item.id
            )
          : (
              item.productId ??
              item.id
            );

      const id =
        Number(rawId);

      const quantity =
        Number(item.quantity);

      if (
        !Number.isInteger(id) ||
        id <= 0 ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid cart item.",
        });
      }

      const key =
        `${productType}-${id}`;

      const existing =
        itemMap.get(key);

      if (existing) {
        existing.quantity +=
          quantity;
      } else {
        itemMap.set(key, {
          productType,

          productId:
            productType === "REGULAR"
              ? id
              : null,

          signatureProductId:
            productType === "SIGNATURE"
              ? id
              : null,

          quantity,
        });
      }
    }

    const normalizedItems =
      Array.from(
        itemMap.values()
      );

    const deliveryCharge =
      Number(
        process.env
          .DELIVERY_CHARGE
      ) || 200;

    /* =====================================
       DATABASE TRANSACTION
    ===================================== */

    const order =
      await prisma.$transaction(
        async (tx) => {
          /* =================================
             SPLIT PRODUCT IDS
          ================================= */

          const regularItems =
            normalizedItems.filter(
              (item) =>
                item.productType ===
                "REGULAR"
            );

          const signatureItems =
            normalizedItems.filter(
              (item) =>
                item.productType ===
                "SIGNATURE"
            );

          const regularProductIds =
            regularItems.map(
              (item) =>
                item.productId
            );

          const signatureProductIds =
            signatureItems.map(
              (item) =>
                item.signatureProductId
            );

          /* =================================
             GET REGULAR PRODUCTS
          ================================= */

          let regularProducts = [];

          if (
            regularProductIds.length >
            0
          ) {
            regularProducts =
              await tx.product.findMany({
                where: {
                  id: {
                    in:
                      regularProductIds,
                  },

                  isActive: true,
                },

                include: {
                  images: {
                    orderBy: {
                      position: "asc",
                    },

                    take: 1,
                  },
                },
              });
          }

          if (
            regularProducts.length !==
            regularProductIds.length
          ) {
            throw new Error(
              "One or more regular products are no longer available."
            );
          }

          /* =================================
             GET SIGNATURE PRODUCTS
          ================================= */

          let signatureProducts =
            [];

          if (
            signatureProductIds.length >
            0
          ) {
            signatureProducts =
              await tx.signatureProduct.findMany({
                where: {
                  id: {
                    in:
                      signatureProductIds,
                  },

                  isActive: true,
                },

                include: {
                  images: {
                    orderBy: {
                      position: "asc",
                    },

                    take: 1,
                  },
                },
              });
          }

          if (
            signatureProducts.length !==
            signatureProductIds.length
          ) {
            throw new Error(
              "One or more signature products are no longer available."
            );
          }

          /* =================================
             MAP PRODUCTS
          ================================= */

          const regularProductMap =
            new Map(
              regularProducts.map(
                (product) => [
                  product.id,
                  product,
                ]
              )
            );

          const signatureProductMap =
            new Map(
              signatureProducts.map(
                (product) => [
                  product.id,
                  product,
                ]
              )
            );

          let subtotal = 0;

          const orderItems = [];

          const notifications = [];

          /* =================================
             PROCESS REGULAR PRODUCTS
          ================================= */

          for (
            const item of
            regularItems
          ) {
            const product =
              regularProductMap.get(
                item.productId
              );

            if (!product) {
              throw new Error(
                "Product not found."
              );
            }

            if (
              product.stock <
              item.quantity
            ) {
              throw new Error(
                `${product.name} only has ${product.stock} item(s) left in stock.`
              );
            }

            const price =
              Number(
                product.discountPrice ??
                  product.originalPrice
              );

            subtotal +=
              price *
              item.quantity;

            orderItems.push({
              productType:
                "REGULAR",

              productId:
                product.id,

              signatureProductId:
                null,

              productName:
                product.name,

              productSlug:
                product.slug,

              imageUrl:
                product.images?.[0]
                  ?.imageUrl ||
                null,

              price,

              quantity:
                item.quantity,
            });

            /* ATOMIC STOCK DECREASE */

            const stockResult =
              await tx.product.updateMany({
                where: {
                  id:
                    product.id,

                  stock: {
                    gte:
                      item.quantity,
                  },
                },

                data: {
                  stock: {
                    decrement:
                      item.quantity,
                  },
                },
              });

            if (
              stockResult.count !== 1
            ) {
              throw new Error(
                `${product.name} does not have enough stock.`
              );
            }

            const newStock =
              product.stock -
              item.quantity;

            if (
              product.stock > 5 &&
              newStock <= 5
            ) {
              notifications.push({
                type:
                  "LOW_STOCK",

                title:
                  "Low Stock",

                message:
                  `${product.name} only has ${newStock} item(s) left.`,

                link:
                  "/admin/products",
              });
            }
          }

          /* =================================
             PROCESS SIGNATURE PRODUCTS
          ================================= */

          for (
            const item of
            signatureItems
          ) {
            const product =
              signatureProductMap.get(
                item.signatureProductId
              );

            if (!product) {
              throw new Error(
                "Signature product not found."
              );
            }

            if (
              product.stock <
              item.quantity
            ) {
              throw new Error(
                `${product.name} only has ${product.stock} item(s) left in stock.`
              );
            }

            const price =
              Number(
                product.discountPrice ??
                  product.originalPrice
              );

            subtotal +=
              price *
              item.quantity;

            orderItems.push({
              productType:
                "SIGNATURE",

              productId:
                null,

              signatureProductId:
                product.id,

              productName:
                product.name,

              productSlug:
                product.slug,

              imageUrl:
                product.images?.[0]
                  ?.imageUrl ||
                null,

              price,

              quantity:
                item.quantity,
            });

            /* SIGNATURE STOCK */

            const stockResult =
              await tx.signatureProduct.updateMany({
                where: {
                  id:
                    product.id,

                  stock: {
                    gte:
                      item.quantity,
                  },
                },

                data: {
                  stock: {
                    decrement:
                      item.quantity,
                  },
                },
              });

            if (
              stockResult.count !== 1
            ) {
              throw new Error(
                `${product.name} does not have enough stock.`
              );
            }

            const newStock =
              product.stock -
              item.quantity;

            if (
              product.stock > 5 &&
              newStock <= 5
            ) {
              notifications.push({
                type:
                  "LOW_STOCK",

                title:
                  "Signature Product Low Stock",

                message:
                  `${product.name} only has ${newStock} item(s) left.`,

                link:
                  "/admin/signature-products",
              });
            }
          }

          /* =================================
             TOTAL
          ================================= */

          const total =
            subtotal +
            deliveryCharge;

          const trackingNumber =
            createTrackingNumber();

          const paymentStatus =
            paymentMethod === "COD"
              ? "COD_PENDING"
              : "PENDING_VERIFICATION";

          /* =================================
             CREATE ORDER
          ================================= */

          const createdOrder =
            await tx.order.create({
              data: {
                trackingNumber,

                customerName:
                  customerName.trim(),

                phone:
                  phone.trim(),

                email:
                  email?.trim() ||
                  null,

                address:
                  address.trim(),

                city:
                  city.trim(),

                notes:
                  notes?.trim() ||
                  null,

                subtotal,

                deliveryCharge,

                total,

                paymentMethod,

                paymentStatus,

                paymentSenderNumber:
                  walletPayment
                    ? paymentSenderNumber.trim()
                    : null,

                paymentReference:
                  walletPayment
                    ? paymentReference.trim()
                    : null,

                paymentProofUrl:
                  walletPayment
                    ? uploadedPaymentProof
                        ?.url ||
                      null
                    : null,

                paymentProofPublicId:
                  walletPayment
                    ? uploadedPaymentProof
                        ?.publicId ||
                      null
                    : null,

                status:
                  "PENDING",

                items: {
                  create:
                    orderItems,
                },
              },

              include: {
                items: true,
              },
            });

          /* =================================
             ORDER NOTIFICATION
          ================================= */

          notifications.unshift({
            type:
              "NEW_ORDER",

            title:
              "New Order",

            message:
              `${customerName.trim()} placed order ${trackingNumber} for Rs. ${Number(
                total
              ).toLocaleString()}.`,

            link:
              "/admin/orders",
          });

          /* =================================
             PAYMENT NOTIFICATION
          ================================= */

          if (walletPayment) {
            notifications.push({
              type:
                "PAYMENT_VERIFICATION",

              title:
                "Payment Verification",

              message:
                `${
                  paymentMethod ===
                  "JAZZCASH"
                    ? "JazzCash"
                    : "EasyPaisa"
                } payment for ${trackingNumber} needs verification.`,

              link:
                "/admin/orders",
            });
          }

          /* =================================
             CREATE ALL NOTIFICATIONS
             SINGLE QUERY
          ================================= */

          if (
            notifications.length > 0
          ) {
            await tx.notification.createMany({
              data:
                notifications,
            });
          }

          return createdOrder;
        },
        {
          maxWait: 15000,
          timeout: 30000,
        }
      );

    /* =====================================
       RESPONSE
    ===================================== */

    return res.status(201).json({
      success: true,

      message:
        "Order placed successfully.",

      data: {
        id:
          order.id,

        trackingNumber:
          order.trackingNumber,

        customerName:
          order.customerName,

        subtotal:
          Number(
            order.subtotal
          ),

        deliveryCharge:
          Number(
            order.deliveryCharge
          ),

        total:
          Number(
            order.total
          ),

        paymentMethod:
          order.paymentMethod,

        paymentStatus:
          order.paymentStatus,

        status:
          order.status,

        createdAt:
          order.createdAt,
      },
    });
  } catch (error) {
    /* =====================================
       CLOUDINARY CLEANUP
    ===================================== */

    if (
      uploadedPaymentProof
        ?.publicId
    ) {
      try {
        await deleteImage(
          uploadedPaymentProof.publicId
        );
      } catch (
        cleanupError
      ) {
        console.error(
          "Payment proof cleanup failed:",
          cleanupError
        );
      }
    }

    /* DUPLICATE UNIQUE FIELD */

    if (
      error?.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,

        message:
          "This payment reference or order value has already been used.",
      });
    }

    /* TRANSACTION START ERROR */

    if (
      error?.code === "P2028" ||
      error?.message?.includes(
        "Unable to start a transaction"
      )
    ) {
      console.error(
        "ORDER TRANSACTION ERROR:",
        error
      );

      return res.status(503).json({
        success: false,

        message:
          "Database is temporarily busy. Please try placing your order again.",
      });
    }

    next(error);
  }
};

/* =========================================
   TRACK ORDER
========================================= */

export const trackOrder = async (
  req,
  res,
  next
) => {
  try {
    const trackingNumber =
      req.params.trackingNumber;

    const phone =
      req.query.phone?.trim();

    if (!phone) {
      return res.status(400).json({
        success: false,

        message:
          "Phone number is required.",
      });
    }

    const order =
      await prisma.order.findFirst({
        where: {
          trackingNumber,
          phone,
        },

        select: {
          trackingNumber: true,

          customerName: true,

          city: true,

          subtotal: true,

          deliveryCharge: true,

          total: true,

          paymentMethod: true,

          paymentStatus: true,

          status: true,

          createdAt: true,

          updatedAt: true,

          items: {
            select: {
              id: true,

              productType: true,

              productId: true,

              signatureProductId:
                true,

              productName: true,

              productSlug: true,

              imageUrl: true,

              price: true,

              quantity: true,
            },
          },
        },
      });

    if (!order) {
      return res.status(404).json({
        success: false,

        message:
          "Order not found. Check your tracking number and phone number.",
      });
    }

    return res.status(200).json({
      success: true,

      data: {
        ...order,

        subtotal:
          Number(
            order.subtotal
          ),

        deliveryCharge:
          Number(
            order.deliveryCharge
          ),

        total:
          Number(
            order.total
          ),

        items:
          order.items.map(
            (item) => ({
              ...item,

              price:
                Number(
                  item.price
                ),
            })
          ),
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   ADMIN - GET ALL ORDERS
========================================= */

export const getAdminOrders = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
      paymentStatus,
      search,
    } = req.query;

    const where = {};

    if (
      status &&
      status !== "ALL"
    ) {
      where.status =
        status;
    }

    if (
      paymentStatus &&
      paymentStatus !== "ALL"
    ) {
      where.paymentStatus =
        paymentStatus;
    }

    if (search?.trim()) {
      const keyword =
        search.trim();

      where.OR = [
        {
          trackingNumber: {
            contains:
              keyword,

            mode:
              "insensitive",
          },
        },

        {
          customerName: {
            contains:
              keyword,

            mode:
              "insensitive",
          },
        },

        {
          phone: {
            contains:
              keyword,
          },
        },
      ];
    }

    const orders =
      await prisma.order.findMany({
        where,

        include: {
          items: true,
        },

        orderBy: {
          createdAt:
            "desc",
        },
      });

    const formatted =
      orders.map(
        (order) => ({
          ...order,

          subtotal:
            Number(
              order.subtotal
            ),

          deliveryCharge:
            Number(
              order.deliveryCharge
            ),

          total:
            Number(
              order.total
            ),

          items:
            order.items.map(
              (item) => ({
                ...item,

                price:
                  Number(
                    item.price
                  ),
              })
            ),
        })
      );

    return res.status(200).json({
      success: true,

      count:
        formatted.length,

      data:
        formatted,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   ADMIN - GET SINGLE ORDER
========================================= */

export const getAdminOrderById =
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

      if (
        !Number.isInteger(
          id
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid order ID.",
        });
      }

      const order =
        await prisma.order.findUnique({
          where: {
            id,
          },

          include: {
            items: true,
          },
        });

      if (!order) {
        return res.status(404).json({
          success: false,

          message:
            "Order not found.",
        });
      }

      return res.status(200).json({
        success: true,

        data: {
          ...order,

          subtotal:
            Number(
              order.subtotal
            ),

          deliveryCharge:
            Number(
              order.deliveryCharge
            ),

          total:
            Number(
              order.total
            ),

          items:
            order.items.map(
              (item) => ({
                ...item,

                price:
                  Number(
                    item.price
                  ),
              })
            ),
        },
      });
    } catch (error) {
      next(error);
    }
  };

/* =========================================
   ADMIN - UPDATE ORDER STATUS
========================================= */

export const updateOrderStatus =
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

      const {
        status,
      } = req.body;

      const allowedStatuses = [
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid order status.",
        });
      }

      const existing =
        await prisma.order.findUnique({
          where: {
            id,
          },
        });

      if (!existing) {
        return res.status(404).json({
          success: false,

          message:
            "Order not found.",
        });
      }

      const updateData = {
        status,
      };

      /* COD DELIVERED = PAID */

      if (
        status ===
          "DELIVERED" &&
        existing.paymentMethod ===
          "COD"
      ) {
        updateData.paymentStatus =
          "PAID";
      }

      const order =
        await prisma.order.update({
          where: {
            id,
          },

          data:
            updateData,
        });

      return res.status(200).json({
        success: true,

        message:
          "Order status updated successfully.",

        data:
          order,
      });
    } catch (error) {
      next(error);
    }
  };

/* =========================================
   ADMIN - VERIFY / REJECT PAYMENT
========================================= */

export const updatePaymentStatus =
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

      const {
        paymentStatus,
      } = req.body;

      const allowedStatuses = [
        "PENDING_VERIFICATION",
        "PAID",
        "REJECTED",
        "COD_PENDING",
      ];

      if (
        !allowedStatuses.includes(
          paymentStatus
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid payment status.",
        });
      }

      const existing =
        await prisma.order.findUnique({
          where: {
            id,
          },
        });

      if (!existing) {
        return res.status(404).json({
          success: false,

          message:
            "Order not found.",
        });
      }

      const order =
        await prisma.order.update({
          where: {
            id,
          },

          data: {
            paymentStatus,
          },
        });

      return res.status(200).json({
        success: true,

        message:
          "Payment status updated successfully.",

        data:
          order,
      });
    } catch (error) {
      next(error);
    }
  };

/* =========================================
   ADMIN - DELETE ORDER
========================================= */

export const deleteOrder = async (
  req,
  res,
  next
) => {
  try {
    const id =
      Number(
        req.params.id
      );

    if (
      !Number.isInteger(
        id
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid order ID.",
      });
    }

    const order =
      await prisma.order.findUnique({
        where: {
          id,
        },

        include: {
          items: true,
        },
      });

    if (!order) {
      return res.status(404).json({
        success: false,

        message:
          "Order not found.",
      });
    }

    /* =====================================
       RESTORE STOCK + DELETE ORDER
    ===================================== */

    await prisma.$transaction(
      async (tx) => {
        if (
          order.status !==
          "DELIVERED"
        ) {
          for (
            const item of
            order.items
          ) {
            const productType =
              normalizeProductType(
                item.productType
              );

            /* SIGNATURE PRODUCT */

            if (
              productType ===
                "SIGNATURE" ||
              item.signatureProductId
            ) {
              if (
                !item.signatureProductId
              ) {
                continue;
              }

              await tx.signatureProduct.updateMany({
                where: {
                  id:
                    item.signatureProductId,
                },

                data: {
                  stock: {
                    increment:
                      item.quantity,
                  },
                },
              });

              continue;
            }

            /* REGULAR PRODUCT */

            if (!item.productId) {
              continue;
            }

            await tx.product.updateMany({
              where: {
                id:
                  item.productId,
              },

              data: {
                stock: {
                  increment:
                    item.quantity,
                },
              },
            });
          }
        }

        await tx.order.delete({
          where: {
            id,
          },
        });
      },
      {
        maxWait: 15000,
        timeout: 30000,
      }
    );

    /* =====================================
       PAYMENT SCREENSHOT CLEANUP
    ===================================== */

    if (
      order.paymentProofPublicId
    ) {
      try {
        await deleteImage(
          order.paymentProofPublicId
        );
      } catch (
        cloudinaryError
      ) {
        console.error(
          "Payment proof cleanup failed:",
          cloudinaryError
        );
      }
    }

    return res.status(200).json({
      success: true,

      message:
        "Order deleted successfully.",
    });
  } catch (error) {
    if (
      error?.code === "P2028" ||
      error?.message?.includes(
        "Unable to start a transaction"
      )
    ) {
      return res.status(503).json({
        success: false,

        message:
          "Database is temporarily busy. Please try again.",
      });
    }

    next(error);
  }
};