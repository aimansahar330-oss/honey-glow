import api from "./api";

export const getSignatureProducts =
  async () => {
    const { data } =
      await api.get(
        "/signature-products"
      );

    return Array.isArray(
      data?.data
    )
      ? data.data
      : [];
  };

export const getPrimarySignatureProduct =
  async () => {
    const { data } =
      await api.get(
        "/signature-products/primary"
      );

    return data?.data || null;
  };

export const getSignatureProductBySlug =
  async (slug) => {
    const { data } =
      await api.get(
        `/signature-products/${slug}`
      );

    return data?.data || null;
  };

export const getSignatureProductReviews =
  async (id) => {
    const { data } =
      await api.get(
        `/signature-products/${id}/reviews`
      );

    return {
      reviews:
        Array.isArray(data?.data)
          ? data.data
          : [],

      averageRating:
        Number(
          data?.averageRating ||
            0
        ),

      reviewCount:
        Number(
          data?.reviewCount ||
            0
        ),
    };
  };

export const addSignatureProductReview =
  async ({
    id,
    payload,
  }) => {
    const { data } =
      await api.post(
        `/signature-products/${id}/reviews`,
        payload
      );

    return data;
  };

export const getAdminSignatureProducts =
  async () => {
    const { data } =
      await api.get(
        "/signature-products/admin"
      );

    return Array.isArray(
      data?.data
    )
      ? data.data
      : [];
  };

export const createSignatureProduct =
  async (formData) => {
    const { data } =
      await api.post(
        "/signature-products",
        formData
      );

    return data;
  };

export const updateSignatureProduct =
  async ({
    id,
    formData,
  }) => {
    const { data } =
      await api.put(
        `/signature-products/${id}`,
        formData
      );

    return data;
  };

export const deleteSignatureProduct =
  async (id) => {
    const { data } =
      await api.delete(
        `/signature-products/${id}`
      );

    return data;
  };