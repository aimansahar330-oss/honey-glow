import api from "./api";

export const getCategories = async () => {
  const { data } = await api.get("/categories");

  return Array.isArray(data?.data)
    ? data.data
    : [];
};

export const getAdminCategories = async () => {
  const { data } = await api.get("/categories/admin");

  return Array.isArray(data?.data)
    ? data.data
    : [];
};

export const createCategory = async (formData) => {
  const { data } = await api.post(
    "/categories",
    formData
  );

  return data;
};

export const updateCategory = async ({
  id,
  formData,
}) => {
  const { data } = await api.put(
    `/categories/${id}`,
    formData
  );

  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(
    `/categories/${id}`
  );

  return data;
};