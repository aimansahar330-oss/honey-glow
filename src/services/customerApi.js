import api from "./api";

export const getAdminCustomers =
  async () => {
    const { data } =
      await api.get(
        "/customers/admin"
      );

    return Array.isArray(
      data?.data
    )
      ? data.data
      : [];
  };