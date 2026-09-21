import prisma from "../lib/prisma.js";

/* =========================================
   GET ADMIN NOTIFICATIONS
========================================= */

export const getAdminNotifications = async (
  req,
  res,
  next
) => {
  try {
    const notifications =
      await prisma.notification.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 30,
      });

    const unreadCount =
      await prisma.notification.count({
        where: {
          isRead: false,
        },
      });

    return res.status(200).json({
      success: true,

      unreadCount,

      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   MARK ONE AS READ
========================================= */

export const markNotificationRead = async (
  req,
  res,
  next
) => {
  try {
    const id =
      Number(req.params.id);

    const notification =
      await prisma.notification.findUnique({
        where: {
          id,
        },
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found.",
      });
    }

    const updated =
      await prisma.notification.update({
        where: {
          id,
        },

        data: {
          isRead: true,
        },
      });

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   MARK ALL AS READ
========================================= */

export const markAllNotificationsRead =
  async (
    req,
    res,
    next
  ) => {
    try {
      await prisma.notification.updateMany({
        where: {
          isRead: false,
        },

        data: {
          isRead: true,
        },
      });

      return res.status(200).json({
        success: true,
        message:
          "Notifications marked as read.",
      });
    } catch (error) {
      next(error);
    }
  };

/* =========================================
   DELETE ONE
========================================= */

export const deleteNotification = async (
  req,
  res,
  next
) => {
  try {
    const id =
      Number(req.params.id);

    const notification =
      await prisma.notification.findUnique({
        where: {
          id,
        },
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found.",
      });
    }

    await prisma.notification.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        "Notification deleted.",
    });
  } catch (error) {
    next(error);
  }
};