import api from "./api";

export const getAdminDashboard =
  async () => {
    const { data } =
      await api.get(
        "/admin/dashboard"
      );

    return data.data;
  };