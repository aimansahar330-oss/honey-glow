import api from "./api";

export const loginAdmin = async (credentials) => {
  const { data } = await api.post(
    "/admin-auth/login",
    credentials,
    {
      skipAuth: true,
    }
  );

  return data;
};

export const getAdminProfile = async () => {
  const token =
    localStorage.getItem(
      "honeyglow_admin_token"
    );

  const { data } = await api.get(
    "/admin-auth/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data.data;
};