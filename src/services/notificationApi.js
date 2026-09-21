import api from "./api";

export const getAdminNotifications =
  async () => {
    const { data } =
      await api.get(
        "/admin/notifications"
      );

    return {
      notifications:
        Array.isArray(data?.data)
          ? data.data
          : [],

      unreadCount:
        Number(
          data?.unreadCount || 0
        ),
    };
  };

export const markNotificationRead =
  async (id) => {
    const { data } =
      await api.patch(
        `/admin/notifications/${id}/read`
      );

    return data;
  };

export const markAllNotificationsRead =
  async () => {
    const { data } =
      await api.patch(
        "/admin/notifications/read-all"
      );

    return data;
  };

export const deleteAdminNotification =
  async (id) => {
    const { data } =
      await api.delete(
        `/admin/notifications/${id}`
      );

    return data;
  };