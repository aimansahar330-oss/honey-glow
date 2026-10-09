import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/* ========================================
   ADMIN AUTH
======================================== */
function getAdminToken() {
  return (
    localStorage.getItem(
      "honeyglow_admin_token"
    ) || ""
  );
}

function getAdminConfig() {
  const token = getAdminToken();

  return {
    headers: {
      Authorization: token
        ? `Bearer ${token}`
        : "",
    },
  };
}

/* ========================================
   PUBLIC - ALL SIGNATURE PRODUCTS
======================================== */

export const getSignatureProducts =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/signature-products`
      );

    return response.data.data;
  };

/* ========================================
   PUBLIC - PRIMARY PRODUCT
======================================== */

export const getPrimarySignatureProduct =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/signature-products/primary`
      );

    return response.data.data;
  };

/* ========================================
   PUBLIC - PRODUCT BY SLUG
======================================== */

export const getSignatureProductBySlug =
  async (slug) => {
    const response =
      await axios.get(
        `${API_URL}/signature-products/${slug}`
      );

    return response.data.data;
  };

/* ========================================
   ADMIN - GET ALL
======================================== */

export const getAdminSignatureProducts =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/signature-products/admin`,
        getAdminConfig()
      );

    return response.data.data;
  };

/* ========================================
   ADMIN - CREATE
======================================== */

export const createSignatureProduct =
  async (formData) => {
    const token =
      getAdminToken();

    const response =
      await axios.post(
        `${API_URL}/signature-products`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

/* ========================================
   ADMIN - UPDATE
======================================== */

export const updateSignatureProduct =
  async ({
    id,
    formData,
  }) => {
    const token =
      getAdminToken();

    const response =
      await axios.put(
        `${API_URL}/signature-products/${id}`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

/* ========================================
   ADMIN - DELETE
======================================== */

export const deleteSignatureProduct =
  async (id) => {
    const response =
      await axios.delete(
        `${API_URL}/signature-products/${id}`,
        getAdminConfig()
      );

    return response.data;
  };

/* ========================================
   REVIEWS - GET
======================================== */

export const getSignatureProductReviews =
  async (id) => {
    const response =
      await axios.get(
        `${API_URL}/signature-products/${id}/reviews`
      );

    return response.data;
  };

/* ========================================
   REVIEWS - ADD
======================================== */

export const addSignatureProductReview =
  async ({
    id,
    payload,
  }) => {
    const response =
      await axios.post(
        `${API_URL}/signature-products/${id}/reviews`,
        payload
      );

    return response.data;
  };