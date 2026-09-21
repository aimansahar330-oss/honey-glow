import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  CreditCard,
  ImagePlus,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/orderApi";

const DELIVERY_CHARGE = 200;

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    clearCart,
  } = useCart();

  const [copied, setCopied] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",

    paymentMethod: "COD",

    paymentSenderNumber: "",
    paymentReference: "",

    paymentProof: null,
    paymentProofPreview: "",
  });

 const orderMutation = useMutation({
  mutationFn: placeOrder,

  onSuccess: (response) => {
    console.log("ORDER SUCCESS RESPONSE:", response);

    const order = response?.data;

    if (!order?.trackingNumber) {
      console.error(
        "Tracking number missing from response:",
        response
      );

      return;
    }

    // Tracking number ko pehle browser mein save karo
    localStorage.setItem(
      "honeyglow_last_tracking",
      order.trackingNumber
    );

    // Customer phone bhi save karo
    localStorage.setItem(
      "honeyglow_last_order_phone",
      form.phone
    );

    // Empty-cart redirect ko disable karo
    setOrderCompleted(true);

    // Success page par pehle navigate karo
    navigate(
      `/order-success?tracking=${encodeURIComponent(
        order.trackingNumber
      )}`,
      {
        replace: true,
        state: {
          order,
        },
      }
    );

    // Navigation ke baad cart clear karo
    setTimeout(() => {
      clearCart();
    }, 0);
  },

  onError: (error) => {
    console.error(
      "ORDER PLACE ERROR:",
      error?.response?.data || error
    );
  },
});


  useEffect(() => {
    return () => {
      if (form.paymentProofPreview) {
        URL.revokeObjectURL(
          form.paymentProofPreview
        );
      }
    };
  }, [form.paymentProofPreview]);

 if (
  !orderCompleted &&
  (
    !Array.isArray(cartItems) ||
    cartItems.length === 0
  )
) {
  return (
    <Navigate
      to="/cart"
      replace
    />
  );
}

  const total =
    Number(subtotal) +
    DELIVERY_CHARGE;

  const walletPayment =
    form.paymentMethod === "JAZZCASH" ||
    form.paymentMethod === "EASYPAISA";

  const paymentNumber =
    form.paymentMethod === "JAZZCASH"
      ? import.meta.env.VITE_JAZZCASH_NUMBER
      : import.meta.env.VITE_EASYPAISA_NUMBER;

  const paymentTitle =
    form.paymentMethod === "JAZZCASH"
      ? import.meta.env.VITE_JAZZCASH_TITLE
      : import.meta.env.VITE_EASYPAISA_TITLE;

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => {
      if (name === "paymentMethod") {
        if (
          previous.paymentProofPreview
        ) {
          URL.revokeObjectURL(
            previous.paymentProofPreview
          );
        }

        return {
          ...previous,

          paymentMethod: value,

          paymentSenderNumber: "",
          paymentReference: "",

          paymentProof: null,
          paymentProofPreview: "",
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });
  };

  const handlePaymentProof = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
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

      e.target.value = "";

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Payment screenshot must be under 5MB."
      );

      e.target.value = "";

      return;
    }

    if (
      form.paymentProofPreview
    ) {
      URL.revokeObjectURL(
        form.paymentProofPreview
      );
    }

    const preview =
      URL.createObjectURL(
        file
      );

    setForm((previous) => ({
      ...previous,

      paymentProof: file,
      paymentProofPreview:
        preview,
    }));

    e.target.value = "";
  };

  const removePaymentProof = () => {
    if (
      form.paymentProofPreview
    ) {
      URL.revokeObjectURL(
        form.paymentProofPreview
      );
    }

    setForm((previous) => ({
      ...previous,

      paymentProof: null,
      paymentProofPreview: "",
    }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

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
          (item) => ({
            productId:
              item.id,

            quantity:
              item.quantity,
          })
        ),
    });
  };

  return (
    <main className="min-h-screen bg-[#fffdfb]">

      {/* =========================
          HEADER
      ========================= */}
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
                Add your delivery details and choose
                the payment method that works best for you.
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

      {/* =========================
          CHECKOUT
      ========================= */}
      <section className="px-5 py-7 sm:px-8 sm:py-8 lg:px-12 xl:px-16">

        <div className="mx-auto grid max-w-[1220px] gap-5 lg:grid-cols-[minmax(0,730px)_320px] lg:justify-center xl:grid-cols-[minmax(0,750px)_330px]">

          {/* =========================
              FORM SIDE
          ========================= */}
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
                    Where should we send your glow?
                  </h2>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
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

                  <CheckoutField label="Email">
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
                <CheckoutField label="Order Notes">
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

                {/* =========================
                    PAYMENT METHODS
                ========================= */}
                <div className="border-t border-[#ead9d6] pt-5">

                  <div className="mb-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#a1737b]">
                      Payment Method
                    </p>

                    <p className="mt-1 text-[10px] text-[#957b80] sm:text-[11px]">
                      Choose how you would like to pay.
                    </p>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-3">

                    {/* COD */}
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

                    {/* JAZZCASH */}
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

                    {/* EASYPAISA */}
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

                  {/* =========================
                      WALLET PAYMENT DETAILS
                  ========================= */}
                  {walletPayment && (
                    <div className="mt-4 overflow-hidden rounded-[18px] border border-[#dfc6c3] bg-gradient-to-br from-[#fff9f7] via-[#fffdfb] to-[#f8e8e5] p-1">

                      <div className="rounded-[15px] border border-white/80 bg-white/55 p-4">

                        {/* PAYMENT ACCOUNT */}
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
                                      size={12}
                                    />
                                  ) : (
                                    <Copy
                                      size={12}
                                    />
                                  )}
                                </button>
                              )}
                            </div>

                            <p className="mt-1 text-[9px] text-[#92767c]">
                              Account Title:{" "}
                              <span className="font-semibold text-[#68464d]">
                                {paymentTitle ||
                                  "HoneyGlow"}
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

                        {/* SENDER / TRANSACTION */}
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
                              onChange={(e) =>
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
                              onChange={(e) =>
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

                        {/* PAYMENT SCREENSHOT */}
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
                                  size={17}
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-semibold text-[#613d44] sm:text-[11px]">
                                  Select payment screenshot
                                </p>

                                <p className="mt-1 text-[8px] text-[#9d8388] sm:text-[9px]">
                                  JPG, PNG or WEBP · Max 5MB
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
                                    {form.paymentProof?.name}
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
                                    size={13}
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
                            Your payment screenshot and transaction
                            ID will be reviewed before the order is
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
                    orderMutation.isPending
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

          {/* =========================
              ORDER SUMMARY
          ========================= */}
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
                          item.id
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
                    value={`Rs. ${Number(
                      subtotal
                    ).toLocaleString()}`}
                  />

                  <SummaryRow
                    label="Delivery"
                    value={`Rs. ${DELIVERY_CHARGE.toLocaleString()}`}
                  />

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

                {/* SELECTED PAYMENT */}
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

                {/* INFO */}
                <div className="mt-4 space-y-2.5">

                  <Feature
                    icon={Truck}
                    text="Delivery across Pakistan"
                  />

                  <Feature
                    icon={PackageCheck}
                    text="Order tracking included"
                  />

                  <Feature
                    icon={CheckCircle2}
                    text="Secure order processing"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
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
    item.images?.[0]?.imageUrl;

  const price =
    Number(
      item.discountPrice ??
        item.originalPrice
    );

  return (
    <div className="flex items-center gap-3">

      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#ead4d0] bg-[#f4e4e0]">

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
          item.quantity
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
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-[10px] text-[#826a6f]">
        {label}
      </span>

      <span className="text-[10px] font-bold text-[#604147]">
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
   INPUT STYLE
===================================================== */

const inputClass =
  "w-full rounded-[11px] border border-[#e2cfcc] bg-white/80 px-3.5 py-2.5 text-[10px] text-[#513a40] outline-none transition placeholder:text-[9px] placeholder:text-[#b29ba0] focus:border-[#a65c69] focus:bg-white sm:text-[11px]";

export default Checkout;