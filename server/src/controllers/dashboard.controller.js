import prisma from "../lib/prisma.js";

export const getAdminDashboard = async (req, res, next) => {
  try {
    /* =====================================
       BASIC COUNTS
    ===================================== */

    const [
      totalOrders,
      activeProducts,
      deliveredOrders,
      allCustomerPhones,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),

      prisma.product.count({
        where: {
          isActive: true,
        },
      }),

      prisma.order.findMany({
        where: {
          status: "DELIVERED",
        },

        select: {
          total: true,
        },
      }),

      prisma.order.findMany({
        select: {
          phone: true,
        },
      }),

      prisma.order.findMany({
        take: 5,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          trackingNumber: true,
          customerName: true,
          phone: true,
          total: true,
          status: true,
          paymentMethod: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
    ]);

    /* =====================================
       REVENUE
    ===================================== */

    const totalRevenue =
      deliveredOrders.reduce(
        (sum, order) =>
          sum + Number(order.total),
        0
      );

    /* =====================================
       UNIQUE CUSTOMERS
    ===================================== */

    const customerPhones =
      new Set(
        allCustomerPhones
          .map((item) =>
            item.phone?.trim()
          )
          .filter(Boolean)
      );

    const totalCustomers =
      customerPhones.size;

    /* =====================================
       LAST 7 DAYS SALES
    ===================================== */

    const sevenDaysAgo =
      new Date();

    sevenDaysAgo.setHours(
      0,
      0,
      0,
      0
    );

    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() - 6
    );

    const recentDeliveredOrders =
      await prisma.order.findMany({
        where: {
          status: "DELIVERED",

          createdAt: {
            gte: sevenDaysAgo,
          },
        },

        select: {
          total: true,
          createdAt: true,
        },
      });

    const salesMap =
      new Map();

    for (let i = 0; i < 7; i++) {
      const date =
        new Date(
          sevenDaysAgo
        );

      date.setDate(
        sevenDaysAgo.getDate() + i
      );

      const key =
        date
          .toISOString()
          .split("T")[0];

      salesMap.set(
        key,
        0
      );
    }

    for (
      const order of
      recentDeliveredOrders
    ) {
      const key =
        new Date(
          order.createdAt
        )
          .toISOString()
          .split("T")[0];

      if (
        salesMap.has(key)
      ) {
        salesMap.set(
          key,
          salesMap.get(key) +
            Number(order.total)
        );
      }
    }

    const salesOverview =
      Array.from(
        salesMap.entries()
      ).map(
        ([date, amount]) => ({
          date,
          amount,
        })
      );

    /* =====================================
       RESPONSE
    ===================================== */

    return res.status(200).json({
      success: true,

      data: {
        stats: {
          revenue:
            totalRevenue,

          orders:
            totalOrders,

          products:
            activeProducts,

          customers:
            totalCustomers,
        },

        salesOverview,

        recentOrders:
          recentOrders.map(
            (order) => ({
              ...order,

              total:
                Number(
                  order.total
                ),
            })
          ),
      },
    });
  } catch (error) {
    next(error);
  }
};