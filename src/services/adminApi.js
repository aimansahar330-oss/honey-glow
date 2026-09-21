import api from "./api";

export const loginAdmin = async (credentials) => {
  const { data } = await api.post(
    "/admin/auth/login",
    credentials
  );

  return data;
};

export const getAdminProfile = async () => {
  const { data } = await api.get("/admin/auth/me");

  return data.data;
};