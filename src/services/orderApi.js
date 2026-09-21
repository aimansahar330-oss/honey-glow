import api from "./api";

/* =========================
   PUBLIC
========================= */

export const placeOrder = async (
  payload
) => {
  const formData =
    new FormData();

  formData.append(
    "customerName",
    payload.customerName
  );

  formData.append(
    "phone",
    payload.phone
  );

  formData.append(
    "email",
    payload.email || ""
  );

  formData.append(
    "address",
    payload.address
  );

  formData.append(
    "city",
    payload.city
  );

  formData.append(
    "notes",
    payload.notes || ""
  );

  formData.append(
    "paymentMethod",
    payload.paymentMethod
  );

  formData.append(
    "items",
    JSON.stringify(
      payload.items
    )
  );

 if (payload.paymentMethod !== "COD") {
  formData.append(
    "paymentSenderNumber",
    payload.paymentSenderNumber
  );

  formData.append(
    "paymentReference",
    payload.paymentReference
  );

  if (payload.paymentProof) {
    formData.append(
      "paymentProof",
      payload.paymentProof
    );
  }
}

  const {
    data,
  } = await api.post(
    "/orders",
    formData
  );

  return data;
};

export const trackOrder = async (
  trackingNumber,
  phone
) => {
  const { data } = await api.get(
    `/orders/track/${encodeURIComponent(
      trackingNumber
    )}`,
    {
      params: {
        phone,
      },
    }
  );

  return data.data;
};

/* =========================
   ADMIN
========================= */

export const getAdminOrders = async (
  params = {}
) => {
  const {
    data,
  } = await api.get(
    "/orders/admin",
    {
      params,
    }
  );

  return Array.isArray(
    data?.data
  )
    ? data.data
    : [];
};

export const getAdminOrderById = async (
  id
) => {
  const {
    data,
  } = await api.get(
    `/orders/admin/${id}`
  );

  return data.data;
};

export const updateOrderStatus = async ({
  id,
  status,
}) => {
  const {
    data,
  } = await api.patch(
    `/orders/admin/${id}/status`,
    {
      status,
    }
  );

  return data;
};

export const updatePaymentStatus = async ({
  id,
  paymentStatus,
}) => {
  const {
    data,
  } = await api.patch(
    `/orders/admin/${id}/payment`,
    {
      paymentStatus,
    }
  );

  return data;
};


export const deleteAdminOrder = async (
  id
) => {
  const { data } =
    await api.delete(
      `/orders/admin/${id}`
    );

  return data;
};