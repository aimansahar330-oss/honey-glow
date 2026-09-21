import prisma from "../lib/prisma.js";

export const getAdminCustomers = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        customerName: true,
        phone: true,
        email: true,
        city: true,
        total: true,
        status: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const customerMap = new Map();

    for (const order of orders) {
      const key = order.phone.trim();

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: order.customerName,
          phone: order.phone,
          email: order.email,
          city: order.city,

          totalOrders: 0,
          totalSpent: 0,

          lastOrderAt: order.createdAt,
        });
      }

      const customer = customerMap.get(key);

      customer.totalOrders += 1;

      /*
        Sirf delivered orders ko actual spent
        amount mein count kar rahe hain.
      */
      if (order.status === "DELIVERED") {
        customer.totalSpent += Number(
          order.total
        );
      }

      if (
        new Date(order.createdAt) >
        new Date(customer.lastOrderAt)
      ) {
        customer.lastOrderAt =
          order.createdAt;

        customer.name =
          order.customerName;

        customer.email =
          order.email;

        customer.city =
          order.city;
      }
    }

    const customers = Array.from(
      customerMap.values()
    );

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};