import api from "./api";

export const getDeliverySettings =
  async () => {
    const { data } = await api.get(
      "/settings/delivery"
    );

    return data.delivery;
  };

export const updateDeliverySettings =
  async (delivery) => {
    const { data } = await api.put(
      "/settings/delivery",
      {
        delivery,
      }
    );

    return data;
  };