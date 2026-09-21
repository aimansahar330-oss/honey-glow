import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  PackageCheck,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { trackOrder } from "../services/orderApi";

const steps = [
  {
    key: "PENDING",
    title: "Order Placed",
    icon: ShoppingBag,
  },
  {
    key: "PROCESSING",
    title: "Processing",
    icon: Package,
  },
  {
    key: "SHIPPED",
    title: "Shipped",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    title: "Delivered",
    icon: CheckCircle2,
  },
];

function TrackOrder() {
  const [searchParams] =
    useSearchParams();

  const queryTracking =
    searchParams.get("tracking") || "";

  const [form, setForm] = useState({
    trackingNumber: "",
    phone: "",
  });

  const [order, setOrder] =
    useState(null);

 useEffect(() => {
  const savedTracking =
    localStorage.getItem(
      "honeyglow_last_tracking"
    );

  const savedPhone =
    localStorage.getItem(
      "honeyglow_last_order_phone"
    );

  setForm((previous) => ({
    ...previous,

    trackingNumber:
      queryTracking ||
      savedTracking ||
      "",

    phone:
      savedPhone || "",
  }));
}, [queryTracking]);


  const trackMutation =
    useMutation({
      mutationFn: ({
        trackingNumber,
        phone,
      }) =>
        trackOrder(
          trackingNumber,
          phone
        ),

      onSuccess: (data) => {
        setOrder(data);

        localStorage.setItem(
          "honeyglow_last_tracking",
          data.trackingNumber
        );
      },

      onError: () => {
        setOrder(null);
      },
    });

  const handleSubmit = (e) => {
    e.preventDefault();

    trackMutation.mutate({
      trackingNumber:
        form.trackingNumber.trim(),

      phone:
        form.phone.trim(),
    });
  };

  return (
    <main className="min-h-screen bg-[#fffdfb]">

      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-[#ecd9d6] bg-gradient-to-br from-[#fff8f5] via-[#fdf0ec] to-[#f8e1df] px-5 py-9 sm:px-8 lg:px-12 xl:px-16">

        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#efcbca]/30 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px]">

          <div className="mb-2 flex items-center gap-2">
            <Sparkles
              size={13}
              className="text-[#974653]"
            />

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9b6871]">
              HoneyGlow Delivery
            </span>
          </div>

          <h1 className="font-beauty text-[38px] font-semibold leading-none tracking-[-0.04em] text-[#43262c] sm:text-[46px]">
            Track your
            <span className="ml-2 text-[#873d4c]">
              glow.
            </span>
          </h1>

          <p className="mt-3 max-w-[500px] text-[11px] leading-5 text-[#806a6e] sm:text-[12px]">
            Enter your tracking number and the phone
            number used while placing your order.
          </p>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 lg:px-12 xl:px-16">

        <div className="mx-auto max-w-[1050px]">

          {/* SEARCH BOX */}
          <div className="mx-auto max-w-[670px] overflow-hidden rounded-[24px] border border-[#e3c9c6] bg-gradient-to-br from-[#fff9f7] to-[#f9e9e6] p-1.5 shadow-[0_12px_40px_rgba(81,45,53,0.07)]">

            <form
              onSubmit={handleSubmit}
              className="rounded-[19px] border border-white/80 bg-white/60 p-4 backdrop-blur-sm sm:p-5"
            >
              <div className="flex items-center gap-3 border-b border-[#ead8d5] pb-4">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0dcda] text-[#82404d]">
                  <Search size={15} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9d7078]">
                    Find Your Order
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#927a80]">
                    Use the same phone number from checkout.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.12em] text-[#77585f]">
                    Tracking Number
                  </label>

                  <input
                    required
                    value={
                      form.trackingNumber
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        trackingNumber:
                          e.target.value,
                      })
                    }
                    placeholder="HG-XXXXXXXX-XXXX"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.12em] text-[#77585f]">
                    Phone Number
                  </label>

                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone:
                          e.target.value,
                      })
                    }
                    placeholder="03XXXXXXXXX"
                    className={inputClass}
                  />
                </div>
              </div>

              {trackMutation.isError && (
                <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[10px] text-red-600">
                  {trackMutation.error
                    ?.response?.data
                    ?.message ||
                    "Unable to find this order."}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  trackMutation.isPending
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#793747] py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-white transition hover:bg-[#612b38] disabled:opacity-60"
              >
                {trackMutation.isPending
                  ? "Finding Order..."
                  : "Track Order"}

                {!trackMutation.isPending && (
                  <Search size={13} />
                )}
              </button>
            </form>
          </div>

          {/* RESULT */}
          {order && (
            <OrderResult
              order={order}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function OrderResult({ order }) {
  const currentIndex =
    getCurrentStep(
      order.status
    );

  return (
    <div className="mt-6">

      {/* ORDER TOP */}
      <div className="rounded-[23px] border border-[#e4cbc7] bg-white p-4 shadow-[0_10px_32px_rgba(73,43,49,0.05)] sm:p-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#a0767d]">
              Tracking Number
            </p>

            <h2 className="mt-1 text-[14px] font-bold tracking-[0.05em] text-[#623740]">
              {order.trackingNumber}
            </h2>

            <p className="mt-1 text-[9px] text-[#9b858a]">
              Placed{" "}
              {formatDate(
                order.createdAt
              )}
            </p>
          </div>

          <StatusBadge
            status={order.status}
          />
        </div>

        {/* TIMELINE */}
        {order.status !==
        "CANCELLED" ? (
          <div className="mt-7">

            <div className="grid grid-cols-4">

              {steps.map(
                (
                  step,
                  index
                ) => {
                  const Icon =
                    step.icon;

                  const completed =
                    index <=
                    currentIndex;

                  return (
                    <div
                      key={
                        step.key
                      }
                      className="relative flex flex-col items-center text-center"
                    >
                      {index < 3 && (
                        <div
                          className={`absolute left-1/2 top-[15px] h-px w-full ${
                            index <
                            currentIndex
                              ? "bg-[#793747]"
                              : "bg-[#e2cdca]"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border ${
                          completed
                            ? "border-[#793747] bg-[#793747] text-white"
                            : "border-[#dfc8c5] bg-[#fff8f6] text-[#b5959b]"
                        }`}
                      >
                        {index <
                        currentIndex ? (
                          <Check
                            size={12}
                          />
                        ) : (
                          <Icon
                            size={12}
                          />
                        )}
                      </div>

                      <p
                        className={`mt-2 text-[7px] font-bold uppercase tracking-[0.08em] ${
                          completed
                            ? "text-[#6f3541]"
                            : "text-[#ae979b]"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-[10px] font-semibold text-red-600">
            This order has been cancelled.
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px]">

        {/* PRODUCTS */}
        <div className="rounded-[22px] border border-[#e5d2cf] bg-white p-4">

          <div className="mb-4 flex items-center gap-2">

            <ShoppingBag
              size={14}
              className="text-[#844451]"
            />

            <h3 className="font-beauty text-[21px] font-semibold text-[#513138]">
              Your Products
            </h3>
          </div>

          <div className="space-y-3">
            {order.items?.map(
              (item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-[15px] border border-[#eadad7] bg-[#fff9f7] p-2.5"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f1e1de]">

                    {item.imageUrl ? (
                      <img
                        src={
                          item.imageUrl
                        }
                        alt={
                          item.productName
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package
                        size={16}
                        className="m-auto mt-5 text-[#b7989e]"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate font-beauty text-[16px] font-semibold text-[#57353c]">
                      {item.productName}
                    </p>

                    <p className="mt-1 text-[8px] text-[#9b8489]">
                      Quantity:{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <p className="text-[9px] font-bold text-[#743743]">
                    Rs.{" "}
                    {(
                      Number(
                        item.price
                      ) *
                      Number(
                        item.quantity
                      )
                    ).toLocaleString()}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* SIDE */}
        <div className="space-y-4">

          {/* PAYMENT */}
          <div className="rounded-[22px] border border-[#e5d2cf] bg-gradient-to-br from-[#fff9f7] to-[#f9e9e6] p-4">

            <div className="flex items-center gap-2">

              <CreditCard
                size={14}
                className="text-[#844451]"
              />

              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#9c737a]">
                Payment
              </p>
            </div>

            <p className="mt-3 text-[11px] font-bold text-[#604048]">
              {paymentMethodLabel(
                order.paymentMethod
              )}
            </p>

            <div className="mt-2">
              <PaymentBadge
                status={
                  order.paymentStatus
                }
              />
            </div>
          </div>

          {/* DELIVERY */}
          <div className="rounded-[22px] border border-[#e5d2cf] bg-white p-4">

            <div className="flex items-center gap-2">

              <MapPin
                size={14}
                className="text-[#844451]"
              />

              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#9c737a]">
                Delivery
              </p>
            </div>

            <p className="mt-3 text-[10px] font-semibold text-[#604048]">
              {order.city}
            </p>

            <p className="mt-1 text-[8px] text-[#9a8388]">
              Delivery across Pakistan
            </p>
          </div>

          {/* TOTAL */}
          <div className="rounded-[22px] border border-[#e5d2cf] bg-white p-4">

            <PriceRow
              label="Subtotal"
              value={
                order.subtotal
              }
            />

            <div className="mt-2">
              <PriceRow
                label="Delivery"
                value={
                  order.deliveryCharge
                }
              />
            </div>

            <div className="mt-3 border-t border-[#ead8d5] pt-3">

              <div className="flex items-end justify-between">

                <span className="text-[9px] font-bold text-[#76585e]">
                  Total
                </span>

                <span className="text-[16px] font-bold text-[#743642]">
                  Rs.{" "}
                  {Number(
                    order.total
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}) {
  const styles = {
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700",

    PROCESSING:
      "border-blue-200 bg-blue-50 text-blue-700",

    SHIPPED:
      "border-violet-200 bg-violet-50 text-violet-700",

    DELIVERED:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    CANCELLED:
      "border-red-200 bg-red-50 text-red-600",
  };

  return (
    <span
      className={`w-fit rounded-full border px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.1em] ${
        styles[status] ||
        styles.PENDING
      }`}
    >
      {status}
    </span>
  );
}

function PaymentBadge({
  status,
}) {
  const config = {
    PAID: {
      text: "Payment Verified",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    PENDING_VERIFICATION: {
      text: "Verification Pending",
      className:
        "border-amber-200 bg-amber-50 text-amber-700",
    },

    COD_PENDING: {
      text: "Cash on Delivery",
      className:
        "border-blue-200 bg-blue-50 text-blue-700",
    },

    REJECTED: {
      text: "Payment Rejected",
      className:
        "border-red-200 bg-red-50 text-red-600",
    },
  };

  const item =
    config[status] ||
    config.COD_PENDING;

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.08em] ${item.className}`}
    >
      {item.text}
    </span>
  );
}

function PriceRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-[9px] text-[#826a70]">
        {label}
      </span>

      <span className="text-[9px] font-bold text-[#604147]">
        Rs.{" "}
        {Number(
          value
        ).toLocaleString()}
      </span>
    </div>
  );
}

function getCurrentStep(
  status
) {
  const statusIndex = {
    PENDING: 0,
    PROCESSING: 1,
    SHIPPED: 2,
    DELIVERED: 3,
  };

  return (
    statusIndex[status] ??
    0
  );
}

function paymentMethodLabel(
  method
) {
  if (
    method ===
    "JAZZCASH"
  ) {
    return "JazzCash";
  }

  if (
    method ===
    "EASYPAISA"
  ) {
    return "EasyPaisa";
  }

  return "Cash on Delivery";
}

function formatDate(
  value
) {
  if (!value) {
    return "-";
  }

  return new Date(
    value
  ).toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

const inputClass =
  "w-full rounded-[11px] border border-[#e2cfcc] bg-white px-3.5 py-2.5 text-[10px] text-[#513a40] outline-none transition placeholder:text-[#b29ba0] focus:border-[#a65c69] sm:text-[11px]";

export default TrackOrder;