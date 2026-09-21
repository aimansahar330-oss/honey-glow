import api from "./api";

export const getProducts = async (params = {}) => {
  const { data } = await api.get(
    "/products",
    {
      params,
    }
  );

  return Array.isArray(data?.data)
    ? data.data
    : [];
};

export const getFeaturedProducts = async () => {
  const { data } = await api.get(
    "/products/featured"
  );

  return Array.isArray(data?.data)
    ? data.data
    : [];
};

export const getProductBySlug = async (slug) => {
  const { data } = await api.get(
    `/products/${slug}`
  );

  return data.data;
};

export const getAdminProducts = async () => {
  const { data } = await api.get(
    "/products/admin"
  );

  return Array.isArray(data?.data)
    ? data.data
    : [];
};

export const createProduct = async (
  formData
) => {
  const { data } = await api.post(
    "/products",
    formData
  );

  return data;
};

export const updateProduct = async ({
  id,
  formData,
}) => {
  const { data } = await api.put(
    `/products/${id}`,
    formData
  );

  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(
    `/products/${id}`
  );

  return data;
};

export const addProductReview = async ({
  productId,
  payload,
}) => {
  const { data } = await api.post(
    `/products/${productId}/reviews`,
    payload
  );

  return data;
};