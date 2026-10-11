import { useEffect, useState } from "react";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  ImagePlus,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Truck,
  Zap,
  X,
} from "lucide-react";

import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";

import { placeOrder } from "../services/orderApi";

import {
  getDeliverySettings,
} from "../services/settingsApi";

/* =====================================================
   CITY NORMALIZER
===================================================== */

const normalizeCity = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\bcity\b/g, "")
    .replace(/[^a-z0-9]/g, "");
};

/* =====================================================
   CHECKOUT
===================================================== */

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    clearCart,
  } = useCart();

  const [copied, setCopied] =
    useState(false);

  const [
    orderCompleted,
    setOrderCompleted,
  ] = useState(false);

  const [
    successOrder,
    setSuccessOrder,
  ] = useState(null);

  const [
    trackingCopied,
    setTrackingCopied,
  ] = useState(false);

  const [form, setForm] =
    useState({
      customerName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      notes: "",

      shippingMethod:
        "standard",

      paymentMethod: "COD",

      paymentSenderNumber: "",
      paymentReference: "",

      paymentProof: null,

      paymentProofPreview: "",
    });

  /* =====================================================
     DELIVERY SETTINGS
  ===================================================== */

  const {
    data: deliverySettings,
    isLoading:
      isDeliveryLoading,
    isError:
      isDeliveryError,
    error:
      deliverySettingsError,
  } = useQuery({
    queryKey: [
      "delivery-settings",
    ],

    queryFn:
      getDeliverySettings,

    staleTime: 0,

    retry: 1,

    refetchOnMount:
      "always",

    refetchOnWindowFocus:
      true,

    refetchOnReconnect:
      true,
  });

  /* =====================================================
     CITY / URGENT DELIVERY
  ===================================================== */

  const normalizedCustomerCity =
    normalizeCity(form.city);

  const urgentDeliveryCities =
    Array.isArray(
      deliverySettings?.urgent
        ?.cities
    )
      ? deliverySettings.urgent.cities.map(
          normalizeCity
        )
      : [];

  const isUrgentCityAllowed =
    Boolean(
      deliverySettings?.urgent
        ?.enabled
    ) &&
    Boolean(
      normalizedCustomerCity
    ) &&
    urgentDeliveryCities.some(
      (allowedCity) =>
        allowedCity ===
        normalizedCustomerCity
    );

  /* =====================================================
     DELIVERY OPTIONS
  ===================================================== */

  const deliveryOptions = [
    {
      key: "standard",

      title:
        "Standard Delivery",

      description:
        "Regular nationwide delivery",

      icon: Truck,

      enabled:
        Boolean(
          deliverySettings
            ?.standard?.enabled
        ),

      allowed: true,

      charge: Number(
        deliverySettings
          ?.standard?.charge || 0
      ),

      eta:
        deliverySettings
          ?.standard
          ?.estimatedDays
          ? `${deliverySettings.standard.estimatedDays} ${
              Number(
                deliverySettings
                  .standard
                  .estimatedDays
              ) === 1
                ? "day"
                : "days"
            }`
          : "",
    },

    {
      key: "express",

      title:
        "Express Delivery",

      description:
        "Faster premium delivery",

      icon: Zap,

      enabled:
        Boolean(
          deliverySettings
            ?.express?.enabled
        ),

      allowed: true,

      charge: Number(
        deliverySettings
          ?.express?.charge || 0
      ),

      eta:
        deliverySettings
          ?.express
          ?.estimatedDays
          ? `${deliverySettings.express.estimatedDays} ${
              Number(
                deliverySettings
                  .express
                  .estimatedDays
              ) === 1
                ? "day"
                : "days"
            }`
          : "",
    },

    {
      key: "overnight",

      title:
        "Overnight Delivery",

      description:
        "Next-day premium delivery",

      icon: Clock3,

      enabled:
        Boolean(
          deliverySettings
            ?.overnight?.enabled
        ),

      allowed: true,

      charge: Number(
        deliverySettings
          ?.overnight?.charge || 0
      ),

      eta:
        deliverySettings
          ?.overnight
          ?.estimatedDays
          ? `${deliverySettings.overnight.estimatedDays} ${
              Number(
                deliverySettings
                  .overnight
                  .estimatedDays
              ) === 1
                ? "day"
                : "days"
            }`
          : "",
    },

    {
      key: "urgent",

      title:
        "Urgent Delivery",

      description:
        isUrgentCityAllowed
          ? "Fast same-city delivery"
          : form.city.trim()
            ? "Not available in this city"
            : "Enter city to check availability",

      icon: MapPin,

      enabled:
        Boolean(
          deliverySettings
            ?.urgent?.enabled
        ),

      allowed:
        isUrgentCityAllowed,

      charge: Number(
        deliverySettings
          ?.urgent?.charge || 0
      ),

      eta:
        deliverySettings
          ?.urgent
          ?.estimatedHoursMin &&
        deliverySettings
          ?.urgent
          ?.estimatedHoursMax
          ? `${deliverySettings.urgent.estimatedHoursMin}-${deliverySettings.urgent.estimatedHoursMax} hours`
          : "",
    },
  ];

  const visibleDeliveryOptions =
    deliveryOptions.filter(
      (option) =>
        option.enabled
    );

  /* =====================================================
     SELECTED DELIVERY
  ===================================================== */

  const selectedDelivery =
    deliveryOptions.find(
      (option) =>
        option.key ===
        form.shippingMethod
    );

  /* =====================================================
     AUTO SELECT VALID DELIVERY METHOD
  ===================================================== */

  useEffect(() => {
    if (
      !deliverySettings ||
      isDeliveryLoading
    ) {
      return;
    }

    if (
      deliverySettings.enabled ===
      false
    ) {
      return;
    }

    const currentMethod =
      deliveryOptions.find(
        (option) =>
          option.key ===
          form.shippingMethod
      );

    const currentValid =
      currentMethod?.enabled &&
      currentMethod?.allowed;

    if (currentValid) {
      return;
    }

    const firstAvailable =
      deliveryOptions.find(
        (option) =>
          option.enabled &&
          option.allowed
      );

    if (firstAvailable) {
      setForm(
        (previous) => ({
          ...previous,

          shippingMethod:
            firstAvailable.key,
        })
      );
    }
  }, [
    deliverySettings,
    isDeliveryLoading,
    form.shippingMethod,
    normalizedCustomerCity,
    isUrgentCityAllowed,
  ]);

  /* =====================================================
     PRICE CALCULATION
  ===================================================== */

  const numericSubtotal =
    Number(subtotal || 0);

  const isFreeDelivery =
    Boolean(
      deliverySettings
        ?.freeDeliveryEnabled
    ) &&
    numericSubtotal >=
      Number(
        deliverySettings
          ?.freeDeliveryThreshold ||
          0
      );

  const deliveryCharge =
    isFreeDelivery
      ? 0
      : Number(
          selectedDelivery
            ?.charge || 0
        );

  const total =
    numericSubtotal +
    deliveryCharge;

  /* =====================================================
     PAYMENT
  ===================================================== */

  const walletPayment =
    form.paymentMethod ===
      "JAZZCASH" ||
    form.paymentMethod ===
      "EASYPAISA";

  const paymentNumber =
    form.paymentMethod ===
    "JAZZCASH"
      ? import.meta.env
          .VITE_JAZZCASH_NUMBER
      : import.meta.env
          .VITE_EASYPAISA_NUMBER;

  const paymentTitle =
    form.paymentMethod ===
    "JAZZCASH"
      ? import.meta.env
          .VITE_JAZZCASH_TITLE
      : import.meta.env
          .VITE_EASYPAISA_TITLE;

  /* =====================================================
     ORDER MUTATION
  ===================================================== */

  const orderMutation =
    useMutation({
      mutationFn:
        placeOrder,

      onSuccess: (
        response
      ) => {
        console.log(
          "ORDER SUCCESS RESPONSE:",
          response
        );

        const order =
          response?.data;

        if (
          !order
            ?.trackingNumber
        ) {
          console.error(
            "Tracking number missing from response:",
            response
          );

          return;
        }

        localStorage.setItem(
          "honeyglow_last_tracking",
          order.trackingNumber
        );

        localStorage.setItem(
          "honeyglow_last_order_phone",
          form.phone
        );

        setOrderCompleted(
          true
        );

        setSuccessOrder(
          order
        );

        clearCart();
      },

      onError: (error) => {
        console.error(
          "ORDER PLACE ERROR:",
          error?.response
            ?.data || error
        );
      },
    });

  /* =====================================================
     CLEAN PAYMENT PREVIEW
  ===================================================== */

  useEffect(() => {
    return () => {
      if (
        form.paymentProofPreview
      ) {
        URL.revokeObjectURL(
          form.paymentProofPreview
        );
      }
    };
  }, [
    form.paymentProofPreview,
  ]);

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (
    !orderCompleted &&
    (
      !Array.isArray(
        cartItems
      ) ||
      cartItems.length ===
        0
    )
  ) {
    return (
      <Navigate
        to="/cart"
        replace
      />
    );
  }

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm(
      (previous) => {
        if (
          name ===
          "paymentMethod"
        ) {
          if (
            previous
              .paymentProofPreview
          ) {
            URL.revokeObjectURL(
              previous
                .paymentProofPreview
            );
          }

          return {
            ...previous,

            paymentMethod:
              value,

            paymentSenderNumber:
              "",

            paymentReference:
              "",

            paymentProof:
              null,

            paymentProofPreview:
              "",
          };
        }

        return {
          ...previous,
          [name]: value,
        };
      }
    );
  };

  /* =====================================================
     PAYMENT PROOF
  ===================================================== */

  const handlePaymentProof =
    (e) => {
      const file =
        e.target.files?.[0];

      if (!file) {
        return;
      }

      const allowedTypes =
        [
          "image/jpeg",
          "image/png",
          "image/webp",
        ];

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        alert(
          "Only JPG, PNG and WEBP images are allowed."
        );

        e.target.value =
          "";

        return;
      }

      if (
        file.size >
        5 *
          1024 *
          1024
      ) {
        alert(
          "Payment screenshot must be under 5MB."
        );

        e.target.value =
          "";

        return;
      }

      if (
        form
          .paymentProofPreview
      ) {
        URL.revokeObjectURL(
          form
            .paymentProofPreview
        );
      }

      const preview =
        URL.createObjectURL(
          file
        );

      setForm(
        (previous) => ({
          ...previous,

          paymentProof:
            file,

          paymentProofPreview:
            preview,
        })
      );

      e.target.value =
        "";
    };

  const removePaymentProof =
    () => {
      if (
        form
          .paymentProofPreview
      ) {
        URL.revokeObjectURL(
          form
            .paymentProofPreview
        );
      }

      setForm(
        (previous) => ({
          ...previous,

          paymentProof:
            null,

          paymentProofPreview:
            "",
        })
      );
    };

  /* =====================================================
     COPY PAYMENT
  ===================================================== */

  const copyPaymentNumber =
    async () => {
      if (!paymentNumber) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          paymentNumber
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1500);
      } catch {
        setCopied(false);
      }
    };

  /* =====================================================
     COPY TRACKING
  ===================================================== */

  const copyTrackingNumber =
    async () => {
      if (
        !successOrder
          ?.trackingNumber
      ) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          successOrder
            .trackingNumber
        );

        setTrackingCopied(
          true
        );

        setTimeout(() => {
          setTrackingCopied(
            false
          );
        }, 1500);
      } catch {
        setTrackingCopied(
          false
        );
      }
    };

  /* =====================================================
     SUCCESS PAGE
  ===================================================== */

  const openOrderSuccessPage =
    () => {
      if (
        !successOrder
          ?.trackingNumber
      ) {
        return;
      }

      navigate(
        `/order-success?tracking=${encodeURIComponent(
          successOrder
            .trackingNumber
        )}`,
        {
          replace: true,

          state: {
            order:
              successOrder,
          },
        }
      );
    };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = (
    e
  ) => {
    e.preventDefault();

    if (
      isDeliveryLoading
    ) {
      alert(
        "Delivery settings are loading. Please wait."
      );

      return;
    }

    if (
      isDeliveryError
    ) {
      alert(
        "Unable to load delivery settings. Please refresh and try again."
      );

      return;
    }

    if (
      deliverySettings
        ?.enabled === false
    ) {
      alert(
        "Delivery service is currently unavailable."
      );

      return;
    }

    if (
      !selectedDelivery ||
      !selectedDelivery.enabled ||
      !selectedDelivery.allowed
    ) {
      alert(
        "Please select an available delivery method."
      );

      return;
    }

    if (
      form.shippingMethod ===
        "urgent" &&
      !isUrgentCityAllowed
    ) {
      alert(
        "Urgent delivery is not available in your city."
      );

      return;
    }

    if (
      walletPayment &&
      !form.paymentSenderNumber.trim()
    ) {
      alert(
        "Please enter the sender number."
      );

      return;
    }

    if (
      walletPayment &&
      !form.paymentReference.trim()
    ) {
      alert(
        "Please enter the transaction ID."
      );

      return;
    }

    if (
      walletPayment &&
      !form.paymentProof
    ) {
      alert(
        "Please upload your payment screenshot."
      );

      return;
    }

    orderMutation.mutate({
      customerName:
        form.customerName.trim(),

      phone:
        form.phone.trim(),

      email:
        form.email.trim(),

      address:
        form.address.trim(),

      city:
        form.city.trim(),

      notes:
        form.notes.trim(),

      shippingMethod:
        form.shippingMethod,

      paymentMethod:
        form.paymentMethod,

      paymentSenderNumber:
        form.paymentSenderNumber.trim(),

      paymentReference:
        form.paymentReference.trim(),

      paymentProof:
        form.paymentProof,

      items:
        cartItems.map(
          (item) => {
            const productType =
              item.productType ===
              "SIGNATURE"
                ? "SIGNATURE"
                : "REGULAR";

            return {
              productType,

              productId:
                productType ===
                "REGULAR"
                  ? item.id
                  : null,

              signatureProductId:
                productType ===
                "SIGNATURE"
                  ? item.id
                  : null,

              quantity:
                item.quantity,
            };
          }
        ),
    });
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#fffdfb]">

      {/* HEADER */}

      <section className="relative overflow-hidden border-b border-[#eedbd8] bg-gradient-to-br from-[#fff8f5] via-[#fdf0ec] to-[#f8e2df] px-5 py-8 sm:px-8 sm:py-9 lg:px-12 xl:px-16">

        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#edc7c7]/30 blur-3xl" />

        <div className="relative mx-auto max-w-[1450px]">

          <div className="mb-2 flex items-center gap-2">

            <Sparkles
              size={13}
              className="text-[#974653]"
            />

            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#9e6871]">
              Almost There
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h1 className="font-beauty text-[37px] font-semibold leading-none tracking-[-0.04em] text-[#43262c] sm:text-[44px]">
                Complete your

                <span className="ml-2 text-[#873d4c]">
                  order.
                </span>
              </h1>

              <p className="mt-3 max-w-[500px] text-[11px] leading-5 text-[#806a6e] sm:text-[12px]">
                Add your delivery details
                and choose the payment
                method that works best
                for you.
              </p>
            </div>

            <Link
              to="/cart"
              className="inline-flex w-fit items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#81404c]"
            >
              <ArrowLeft
                size={12}
              />

              Back to Cart
            </Link>
          </div>
        </div>
      </section>

      {/* CHECKOUT */}

      <section className="px-5 py-7 sm:px-8 sm:py-8 lg:px-12 xl:px-16">

        <div className="mx-auto grid max-w-[1220px] gap-5 lg:grid-cols-[minmax(0,730px)_320px] lg:justify-center xl:grid-cols-[minmax(0,750px)_330px]">

          {/* FORM */}

          <div className="h-fit overflow-hidden rounded-[22px] border border-[#e5cbc8] bg-gradient-to-br from-[#fff9f7] via-[#fffdfb] to-[#faece9] p-1.5 shadow-[0_12px_38px_rgba(84,47,56,0.06)]">

            <div className="rounded-[18px] border border-white/80 bg-white/60 p-4 backdrop-blur-sm sm:p-5">

              {/* FORM HEADER */}

              <div className="flex items-center gap-3 border-b border-[#ead9d6] pb-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1ddda] text-[#873e4c]">

                  <MapPin
                    size={16}
                  />
                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#a1737b]">
                    Delivery Details
                  </p>

                  <h2 className="font-beauty mt-0.5 text-[23px] font-semibold text-[#503138] sm:text-[25px]">
                    Where should we send
                    your care?
                  </h2>
                </div>
              </div>

              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-5 space-y-4"
              >

                {/* NAME + PHONE */}

                <div className="grid gap-3 sm:grid-cols-2">

                  <CheckoutField
                    label="Full Name"
                    required
                  >
                    <input
                      required
                      name="customerName"
                      value={
                        form.customerName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Your full name"
                      className={
                        inputClass
                      }
                    />
                  </CheckoutField>

                  <CheckoutField
                    label="Phone Number"
                    required
                  >
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={
                        form.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="03XXXXXXXXX"
                      className={
                        inputClass
                      }
                    />
                  </CheckoutField>
                </div>

                {/* EMAIL + CITY */}

                <div className="grid gap-3 sm:grid-cols-2">

                  <CheckoutField
                    label="Email"
                  >
                    <input
                      type="email"
                      name="email"
                      value={
                        form.email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Optional"
                      className={
                        inputClass
                      }
                    />
                  </CheckoutField>

                  <CheckoutField
                    label="City"
                    required
                  >
                    <input
                      required
                      name="city"
                      value={
                        form.city
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Your city"
                      className={
                        inputClass
                      }
                    />
                  </CheckoutField>
                </div>

                {/* ADDRESS */}

                <CheckoutField
                  label="Delivery Address"
                  required
                >
                  <textarea
                    required
                    rows="2"
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House no, street, area..."
                    className={`${inputClass} resize-none`}
                  />
                </CheckoutField>

                {/* NOTES */}

                <CheckoutField
                  label="Order Notes"
                >
                  <textarea
                    rows="2"
                    name="notes"
                    value={
                      form.notes
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Optional delivery instructions..."
                    className={`${inputClass} resize-none`}
                  />
                </CheckoutField>

                {/* =====================================================
                    DELIVERY METHOD
                ===================================================== */}

                <div className="border-t border-[#ead9d6] pt-5">

                  <div className="mb-3 flex items-end justify-between gap-4">

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#a1737b]">
                        Delivery Method
                      </p>

                      <p className="mt-1 text-[10px] text-[#957b80] sm:text-[11px]">
                        Choose the delivery
                        option that suits you.
                      </p>
                    </div>

                    {isFreeDelivery && (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[7px] font-bold uppercase tracking-[0.12em] text-emerald-600">
                        Free Delivery
                      </span>
                    )}
                  </div>

                  {isDeliveryLoading ? (

                    <div className="grid gap-2.5 sm:grid-cols-2">

                      {[1, 2].map(
                        (item) => (
                          <div
                            key={
                              item
                            }
                            className="h-[92px] animate-pulse rounded-[16px] bg-[#f3e7e5]"
                          />
                        )
                      )}
                    </div>

                  ) : isDeliveryError ? (

                    <div className="rounded-[15px] border border-red-100 bg-red-50 px-4 py-3 text-[9px] text-red-600">
                      {deliverySettingsError
                        ?.response
                        ?.data
                        ?.message ||
                        "Unable to load delivery options."}
                    </div>

                  ) : deliverySettings
                      ?.enabled ===
                    false ? (

                    <div className="rounded-[15px] border border-amber-200 bg-amber-50 px-4 py-3">

                      <p className="text-[9px] font-semibold text-amber-700">
                        Delivery service is
                        currently unavailable.
                      </p>
                    </div>

                  ) : visibleDeliveryOptions.length ===
                    0 ? (

                    <div className="rounded-[15px] border border-amber-200 bg-amber-50 px-4 py-3">

                      <p className="text-[9px] font-semibold text-amber-700">
                        No delivery method is
                        currently available.
                      </p>
                    </div>

                  ) : (

                    <div className="grid gap-2.5 sm:grid-cols-2">

                      {visibleDeliveryOptions.map(
                        (
                          option
                        ) => (
                          <DeliveryOption
                            key={
                              option.key
                            }
                            option={
                              option
                            }
                            selected={
                              form.shippingMethod ===
                              option.key
                            }
                            free={
                              isFreeDelivery
                            }
                            onSelect={() => {
                              if (
                                !option.allowed
                              ) {
                                return;
                              }

                              setForm(
                                (
                                  previous
                                ) => ({
                                  ...previous,

                                  shippingMethod:
                                    option.key,
                                })
                              );
                            }}
                          />
                        )
                      )}
                    </div>
                  )}

                  {deliverySettings
                    ?.freeDeliveryEnabled &&
                    !isFreeDelivery && (
                      <div className="mt-3 rounded-xl border border-[#ead7d4] bg-[#fff8f6] px-3 py-2.5">

                        <p className="text-[8px] leading-4 text-[#876b71]">

                          Add{" "}

                          <span className="font-bold text-[#753b48]">

                            Rs.{" "}

                            {Math.max(
                              Number(
                                deliverySettings
                                  .freeDeliveryThreshold ||
                                  0
                              ) -
                                numericSubtotal,
                              0
                            ).toLocaleString()}

                          </span>{" "}

                          more to unlock free
                          delivery.
                        </p>
                      </div>
                    )}
                </div>

                {/* =====================================================
                    PAYMENT
                ===================================================== */}

                <div className="border-t border-[#ead9d6] pt-5">

                  <div className="mb-3">

                    <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#a1737b]">
                      Payment Method
                    </p>

                    <p className="mt-1 text-[10px] text-[#957b80] sm:text-[11px]">
                      Choose how you would
                      like to pay.
                    </p>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-3">

                    <PaymentOption
                      name="paymentMethod"
                      value="COD"
                      checked={
                        form.paymentMethod ===
                        "COD"
                      }
                      onChange={
                        handleChange
                      }
                      icon={
                        CreditCard
                      }
                      title="Cash on Delivery"
                      description="Pay when your order arrives."
                    />

                    <PaymentOption
                      name="paymentMethod"
                      value="JAZZCASH"
                      checked={
                        form.paymentMethod ===
                        "JAZZCASH"
                      }
                      onChange={
                        handleChange
                      }
                      icon={
                        Smartphone
                      }
                      title="JazzCash"
                      description="Pay through your wallet."
                    />

                    <PaymentOption
                      name="paymentMethod"
                      value="EASYPAISA"
                      checked={
                        form.paymentMethod ===
                        "EASYPAISA"
                      }
                      onChange={
                        handleChange
                      }
                      icon={
                        Smartphone
                      }
                      title="EasyPaisa"
                      description="Pay through your wallet."
                    />
                  </div>

                  {/* WALLET */}

                  {walletPayment && (

                    <div className="mt-4 overflow-hidden rounded-[18px] border border-[#dfc6c3] bg-gradient-to-br from-[#fff9f7] via-[#fffdfb] to-[#f8e8e5] p-1">

                      <div className="rounded-[15px] border border-white/80 bg-white/55 p-4">

                        {/* ACCOUNT */}

                        <div className="flex flex-col gap-3 border-b border-[#ead4d1] pb-4 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#9b6871]">
                              Send Payment To
                            </p>

                            <div className="mt-1.5 flex items-center gap-2">

                              <p className="text-[15px] font-bold tracking-[0.03em] text-[#623740]">
                                {paymentNumber ||
                                  "Add number in .env"}
                              </p>

                              {paymentNumber && (

                                <button
                                  type="button"
                                  onClick={
                                    copyPaymentNumber
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#dfc6c3] bg-white text-[#82404c] transition hover:bg-[#f5e6e3]"
                                >
                                  {copied ? (
                                    <CheckCircle2
                                      size={
                                        12
                                      }
                                    />
                                  ) : (
                                    <Copy
                                      size={
                                        12
                                      }
                                    />
                                  )}
                                </button>
                              )}
                            </div>

                            <p className="mt-1 text-[9px] text-[#92767c]">

                              Account Title:{" "}

                              <span className="font-semibold text-[#68464d]">
                                {paymentTitle ||
                                  "KM Cares"}
                              </span>
                            </p>
                          </div>

                          <div className="w-fit rounded-full bg-[#793747] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">

                            {form.paymentMethod ===
                            "JAZZCASH"
                              ? "JazzCash"
                              : "EasyPaisa"}
                          </div>
                        </div>

                        {/* SENDER */}

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">

                          <CheckoutField
                            label="Sender Number"
                            required
                          >
                            <input
                              required
                              type="tel"
                              value={
                                form.paymentSenderNumber
                              }
                              onChange={(
                                e
                              ) =>
                                setForm(
                                  (
                                    previous
                                  ) => ({
                                    ...previous,

                                    paymentSenderNumber:
                                      e
                                        .target
                                        .value,
                                  })
                                )
                              }
                              placeholder="03XXXXXXXXX"
                              className={
                                inputClass
                              }
                            />
                          </CheckoutField>

                          <CheckoutField
                            label="Transaction ID"
                            required
                          >
                            <input
                              required
                              value={
                                form.paymentReference
                              }
                              onChange={(
                                e
                              ) =>
                                setForm(
                                  (
                                    previous
                                  ) => ({
                                    ...previous,

                                    paymentReference:
                                      e
                                        .target
                                        .value,
                                  })
                                )
                              }
                              placeholder="Enter transaction ID"
                              className={
                                inputClass
                              }
                            />
                          </CheckoutField>
                        </div>

                        {/* SCREENSHOT */}

                        <div className="mt-4">

                          <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-[#77585f] sm:text-[10px]">

                            Payment Screenshot

                            <span className="ml-1 text-[#a94354]">
                              *
                            </span>
                          </label>

                          {!form.paymentProofPreview ? (

                            <label className="group flex cursor-pointer items-center gap-3 rounded-[15px] border-2 border-dashed border-[#d9bdbb] bg-white/65 p-3.5 transition hover:border-[#a55b68] hover:bg-white">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0dcda] text-[#82404d]">

                                <ImagePlus
                                  size={
                                    17
                                  }
                                />
                              </div>

                              <div className="min-w-0 flex-1">

                                <p className="text-[10px] font-semibold text-[#613d44] sm:text-[11px]">
                                  Select payment
                                  screenshot
                                </p>

                                <p className="mt-1 text-[8px] text-[#9d8388] sm:text-[9px]">
                                  JPG, PNG or WEBP ·
                                  Max 5MB
                                </p>
                              </div>

                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                  handlePaymentProof
                                }
                                className="hidden"
                              />
                            </label>

                          ) : (

                            <div className="relative overflow-hidden rounded-[15px] border border-[#dec5c2] bg-white/70 p-2">

                              <div className="flex items-center gap-3">

                                <img
                                  src={
                                    form.paymentProofPreview
                                  }
                                  alt="Payment proof"
                                  className="h-20 w-20 shrink-0 rounded-xl object-cover"
                                />

                                <div className="min-w-0 flex-1">

                                  <p className="truncate text-[10px] font-semibold text-[#613d44]">
                                    {
                                      form
                                        .paymentProof
                                        ?.name
                                    }
                                  </p>

                                  <p className="mt-1 text-[8px] text-[#9d8388]">

                                    {form.paymentProof
                                      ? (
                                          form
                                            .paymentProof
                                            .size /
                                          1024 /
                                          1024
                                        ).toFixed(
                                          2
                                        )
                                      : "0.00"}{" "}

                                    MB
                                  </p>

                                  <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#82404d]">

                                    Change Image

                                    <input
                                      type="file"
                                      accept="image/jpeg,image/png,image/webp"
                                      onChange={
                                        handlePaymentProof
                                      }
                                      className="hidden"
                                    />
                                  </label>
                                </div>

                                <button
                                  type="button"
                                  onClick={
                                    removePaymentProof
                                  }
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-100 text-red-400 transition hover:bg-red-50"
                                >
                                  <X
                                    size={
                                      13
                                    }
                                  />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#f7e8e5] px-3 py-2.5">

                          <CheckCircle2
                            size={13}
                            className="mt-0.5 shrink-0 text-[#8d4754]"
                          />

                          <p className="text-[8px] leading-4 text-[#876b71] sm:text-[9px]">
                            Your payment
                            screenshot and
                            transaction ID will
                            be reviewed before
                            the order is
                            processed.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ERROR */}

                {orderMutation.isError && (

                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[10px] text-red-600">

                    {orderMutation.error
                      ?.response?.data
                      ?.message ||
                      "Unable to place order."}
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    orderMutation.isPending ||
                    isDeliveryLoading ||
                    isDeliveryError ||
                    deliverySettings
                      ?.enabled ===
                      false ||
                    !selectedDelivery ||
                    !selectedDelivery.allowed
                  }
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#793747] py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_25px_rgba(121,55,71,0.2)] transition hover:bg-[#622c39] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {orderMutation.isPending
                    ? "Placing Order..."
                    : "Place Order"}

                  {!orderMutation.isPending && (
                    <ArrowRight
                      size={13}
                      className="transition group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="lg:sticky lg:top-[95px] lg:self-start">

            <div className="overflow-hidden rounded-[22px] border border-[#e4c9c6] bg-gradient-to-b from-[#fff8f6] via-[#fdf1ee] to-[#f8e6e2] p-1.5 shadow-[0_14px_40px_rgba(80,44,53,0.08)]">

              <div className="rounded-[17px] border border-white/70 bg-white/60 p-4 backdrop-blur-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#a17079]">
                      Your Order
                    </p>

                    <h2 className="font-beauty mt-1 text-[23px] font-semibold text-[#4e3037]">
                      Order Summary
                    </h2>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0dcda]">

                    <ShoppingBag
                      size={16}
                      className="text-[#884351]"
                    />
                  </div>
                </div>

                {/* PRODUCTS */}

                <div className="mt-4 max-h-[230px] space-y-3 overflow-y-auto pr-1">

                  {cartItems.map(
                    (item) => (

                      <CheckoutItem
                        key={
                          item.cartKey ||
                          `${item.productType || "REGULAR"}-${item.id}`
                        }
                        item={
                          item
                        }
                      />
                    )
                  )}
                </div>

                {/* TOTALS */}

                <div className="mt-4 space-y-3 border-t border-[#ead8d5] pt-4">

                  <SummaryRow
                    label="Subtotal"
                    value={`Rs. ${numericSubtotal.toLocaleString()}`}
                  />

                  <SummaryRow
                    label={
                      selectedDelivery
                        ? selectedDelivery.title
                        : "Delivery"
                    }
                    value={
                      isFreeDelivery
                        ? "FREE"
                        : isDeliveryLoading
                          ? "..."
                          : `Rs. ${deliveryCharge.toLocaleString()}`
                    }
                    highlight={
                      isFreeDelivery
                    }
                  />

                  {selectedDelivery?.eta && (

                    <SummaryRow
                      label="Estimated Time"
                      value={
                        selectedDelivery.eta
                      }
                    />
                  )}

                  <div className="border-t border-[#ead8d5] pt-3">

                    <div className="flex items-end justify-between">

                      <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#775a61]">
                        Total
                      </span>

                      <span className="text-[17px] font-bold text-[#743643]">

                        Rs.{" "}

                        {Number(
                          total
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PAYMENT */}

                <div className="mt-4 rounded-xl border border-[#ead7d4] bg-white/45 px-3 py-2.5">

                  <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#9d757d]">
                    Payment
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#634149]">

                    {form.paymentMethod ===
                    "COD"
                      ? "Cash on Delivery"
                      : form.paymentMethod ===
                          "JAZZCASH"
                        ? "JazzCash"
                        : "EasyPaisa"}
                  </p>
                </div>

                {/* DELIVERY SELECTED */}

                {selectedDelivery && (

                  <div className="mt-3 rounded-xl border border-[#ead7d4] bg-white/45 px-3 py-2.5">

                    <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#9d757d]">
                      Delivery
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-[#634149]">
                      {
                        selectedDelivery.title
                      }
                    </p>

                    {selectedDelivery.eta && (

                      <p className="mt-0.5 text-[8px] text-[#9a8186]">
                        Estimated:{" "}
                        {
                          selectedDelivery.eta
                        }
                      </p>
                    )}
                  </div>
                )}

                {/* INFO */}

                <div className="mt-4 space-y-2.5">

                  <Feature
                    icon={
                      Truck
                    }
                    text="Delivery across Pakistan"
                  />

                  <Feature
                    icon={
                      PackageCheck
                    }
                    text="Order tracking included"
                  />

                  <Feature
                    icon={
                      CheckCircle2
                    }
                    text="Secure order processing"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* SUCCESS POPUP */}

      {successOrder && (

        <OrderSuccessPopup
          order={
            successOrder
          }
          trackingCopied={
            trackingCopied
          }
          copyTrackingNumber={
            copyTrackingNumber
          }
          onContinue={
            openOrderSuccessPage
          }
        />
      )}
    </main>
  );
}

/* =====================================================
   DELIVERY OPTION
===================================================== */

function DeliveryOption({
  option,
  selected,
  free,
  onSelect,
}) {
  const Icon =
    option.icon;

  const disabled =
    !option.allowed;

  return (
    <button
      type="button"
      disabled={
        disabled
      }
      onClick={
        onSelect
      }
      className={`
        relative
        flex
        min-h-[92px]
        w-full
        items-center
        gap-3
        rounded-[16px]
        border
        p-3
        text-left
        transition
        duration-300

        ${
          selected
            ? "border-[#934b5a] bg-[#f8e8e6] shadow-[0_8px_24px_rgba(121,55,71,0.10)]"
            : "border-[#e4cfcc] bg-[#fffaf8] hover:border-[#c998a0]"
        }

        ${
          disabled
            ? "cursor-not-allowed opacity-45"
            : ""
        }
      `}
    >

      <div
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          transition

          ${
            selected
              ? "bg-[#793747] text-white"
              : "bg-[#f1dfdc] text-[#81404c]"
          }
        `}
      >
        <Icon
          size={16}
        />
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-start justify-between gap-2">

          <p className="text-[10px] font-bold text-[#58383f]">
            {option.title}
          </p>

          <span
            className={`shrink-0 text-[9px] font-bold ${
              free
                ? "text-emerald-600"
                : "text-[#773744]"
            }`}
          >
            {free
              ? "FREE"
              : `Rs. ${option.charge.toLocaleString()}`}
          </span>
        </div>

        <p className="mt-0.5 text-[8px] leading-3.5 text-[#9a8287]">
          {option.description}
        </p>

        {option.eta && (
          <p className="mt-1 text-[7px] font-semibold text-[#87515d]">
            Estimated{" "}
            {option.eta}
          </p>
        )}
      </div>

      <span
        className={`
          h-4
          w-4
          shrink-0
          rounded-full
          border-2

          ${
            selected
              ? "border-[#793747] bg-[#793747] shadow-[inset_0_0_0_3px_white]"
              : "border-[#cfb8bd]"
          }
        `}
      />
    </button>
  );
}

/* =====================================================
   ORDER SUCCESS POPUP
===================================================== */

function OrderSuccessPopup({
  order,
  trackingCopied,
  copyTrackingNumber,
  onContinue,
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#3d252c]/55 px-4 backdrop-blur-[6px]">

      <div className="relative w-full max-w-[430px] overflow-hidden rounded-[28px] border border-[#ead6d4] bg-[#fffaf8] shadow-[0_35px_100px_rgba(58,31,39,0.28)]">

        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#ead1d8]/50 blur-3xl" />

        <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-[#e9d4af]/25 blur-3xl" />

        <div className="relative p-6 text-center sm:p-8">

          <div className="relative mx-auto flex h-[78px] w-[78px] items-center justify-center">

            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/10" />

            <div className="absolute inset-2 rounded-full border border-emerald-200 bg-emerald-50" />

            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_10px_28px_rgba(34,197,94,0.25)]">

              <CheckCircle2
                size={24}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">

            <Sparkles
              size={11}
              className="text-[#a86672]"
            />

            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#a86672]">
              KM Cares
            </p>
          </div>

          <h2 className="font-beauty mt-2 text-[31px] font-semibold leading-none text-[#4e3037] sm:text-[35px]">

            Order placed

            <span className="ml-2 text-[#8d4351]">
              successfully.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-[330px] text-[10px] leading-5 text-[#8d7479]">
            Thank you for shopping with
            KM Cares. Your order has been
            received and is now being
            processed.
          </p>

          <div className="mt-6 rounded-[18px] border border-[#e3cdca] bg-gradient-to-br from-[#fff8f6] to-[#f7e7e4] p-4">

            <p className="text-[7px] font-bold uppercase tracking-[0.17em] text-[#a27a80]">
              Tracking Number
            </p>

            <div className="mt-2 flex items-center justify-center gap-2">

              <p className="break-all text-[15px] font-bold tracking-[0.04em] text-[#663640]">
                {
                  order.trackingNumber
                }
              </p>

              <button
                type="button"
                onClick={
                  copyTrackingNumber
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ddc4c1] bg-white text-[#81404c] transition hover:bg-[#f3dfdc]"
              >
                {trackingCopied ? (

                  <CheckCircle2
                    size={13}
                  />
                ) : (

                  <Copy
                    size={13}
                  />
                )}
              </button>
            </div>

            {trackingCopied && (

              <p className="mt-2 text-[7px] font-semibold text-emerald-600">
                Tracking number copied
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#f5e6e3] px-3 py-2.5">

            <PackageCheck
              size={14}
              className="shrink-0 text-[#884451]"
            />

            <p className="text-[8px] font-medium text-[#76575d]">
              Keep your tracking number
              safe to check your order
              status.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onContinue
            }
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#793747] py-3.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_28px_rgba(121,55,71,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#612b38]"
          >
            View Order Details

            <ArrowRight
              size={13}
              className="transition duration-300 group-hover:translate-x-1"
            />
          </button>

          <p className="mt-3 text-[7px] text-[#aa9296]">
            Your order confirmation has
            been saved.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   PAYMENT OPTION
===================================================== */

function PaymentOption({
  name,
  value,
  checked,
  onChange,
  icon: Icon,
  title,
  description,
}) {
  return (
    <label
      className={`relative flex cursor-pointer items-center gap-2.5 rounded-[15px] border p-3 transition duration-300 ${
        checked
          ? "border-[#9a5360] bg-[#f8e8e5] shadow-[0_7px_20px_rgba(121,55,71,0.08)]"
          : "border-[#e3cecb] bg-[#fffaf8] hover:border-[#c99fa4]"
      }`}
    >

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
          checked
            ? "bg-[#793747] text-white"
            : "bg-[#f1dfdc] text-[#81404c]"
        }`}
      >
        <Icon
          size={15}
        />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-[10px] font-bold text-[#58383f]">
          {title}
        </p>

        <p className="mt-0.5 text-[8px] leading-3.5 text-[#9a8287]">
          {description}
        </p>
      </div>

      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-[#793747]"
      />
    </label>
  );
}

/* =====================================================
   CHECKOUT FIELD
===================================================== */

function CheckoutField({
  label,
  required,
  children,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-[#77585f] sm:text-[10px]">

        {label}

        {required && (

          <span className="ml-1 text-[#a94354]">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

/* =====================================================
   CHECKOUT ITEM
===================================================== */

function CheckoutItem({
  item,
}) {
  const image =
    item.images?.[0]
      ?.imageUrl ||
    item.imageUrl ||
    null;

  const price =
    Number(
      item.discountPrice ??
        item.originalPrice
    ) || 0;

  const isSignature =
    item.productType ===
    "SIGNATURE";

  return (
    <div className="flex items-center gap-3">

      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#ead4d0] bg-[#f4e4e0]">

        {image ? (

          <img
            src={image}
            alt={
              item.name
            }
            className="h-full w-full object-cover"
          />
        ) : (

          <div className="h-full w-full bg-gradient-to-br from-[#f1d9d5] to-[#edd7ad]" />
        )}
      </div>

      <div className="min-w-0 flex-1">

        {isSignature && (

          <p className="mb-0.5 text-[5px] font-bold uppercase tracking-[0.12em] text-[#77447d]">
            KM Cares Signature
          </p>
        )}

        <p className="truncate font-beauty text-[15px] font-semibold text-[#54343b]">
          {item.name}
        </p>

        <p className="mt-0.5 text-[9px] text-[#9c8489]">
          Qty:{" "}
          {item.quantity}
        </p>
      </div>

      <p className="shrink-0 text-[9px] font-bold text-[#733844]">

        Rs.{" "}

        {(
          price *
          Number(
            item.quantity
          )
        ).toLocaleString()}
      </p>
    </div>
  );
}

/* =====================================================
   SUMMARY ROW
===================================================== */

function SummaryRow({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-[10px] text-[#826a6f]">
        {label}
      </span>

      <span
        className={`text-[10px] font-bold ${
          highlight
            ? "text-emerald-600"
            : "text-[#604147]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* =====================================================
   FEATURE
===================================================== */

function Feature({
  icon: Icon,
  text,
}) {
  return (
    <div className="flex items-center gap-2 text-[9px] text-[#8e747a]">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f1e0dd] text-[#854451]">

        <Icon
          size={11}
        />
      </div>

      {text}
    </div>
  );
}

/* =====================================================
   INPUT CLASS
===================================================== */

const inputClass =
  "w-full rounded-[11px] border border-[#e2cfcc] bg-white/80 px-3.5 py-2.5 text-[10px] text-[#513a40] outline-none transition placeholder:text-[9px] placeholder:text-[#b29ba0] focus:border-[#a65c69] focus:bg-white sm:text-[11px]";

export default Checkout;