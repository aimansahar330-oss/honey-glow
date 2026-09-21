import {
  ArrowRight,
  Check,
  Copy,
  PackageCheck,
} from "lucide-react";
import {
  Link,
  Navigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import { useState, useEffect } from "react";

function OrderSuccess() {
  const location =
    useLocation();

  const [searchParams] =
    useSearchParams();

  const [copied, setCopied] =
    useState(false);

  const trackingNumber =
    location.state?.order
      ?.trackingNumber ||
    searchParams.get(
      "tracking"
    );

  if (!trackingNumber) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  useEffect(() => {
  if (!trackingNumber) return;

  localStorage.setItem(
    "honeyglow_last_tracking",
    trackingNumber
  );
}, [trackingNumber]);

  const copyTracking =
    async () => {
      await navigator.clipboard.writeText(
        trackingNumber
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    };

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#fffdfb] px-5 py-14">

      <div className="w-full max-w-[560px] text-center">

        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">

          <div className="absolute inset-0 rounded-full border border-[#d8b9b8]" />

          <div className="absolute inset-2 rounded-full border border-dashed border-[#e5cbc7]" />

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#793747] text-white shadow-[0_10px_25px_rgba(121,55,71,0.2)]">
            <Check
              size={20}
            />
          </div>
        </div>

        <p className="mt-6 text-[7px] font-bold uppercase tracking-[0.22em] text-[#a06b75]">
          Order Confirmed
        </p>

        <h1 className="font-beauty mt-2 text-[37px] font-semibold text-[#4b2d34] sm:text-[44px]">
          Your glow is
          <span className="ml-2 text-[#873d4c]">
            on its way.
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-[390px] text-[9px] leading-5 text-[#90777c]">
          Thank you for shopping with HoneyGlow.
          Save your tracking number to check
          your order status anytime.
        </p>

        {/* TRACKING */}
        <div className="mx-auto mt-7 max-w-[370px] rounded-[20px] border border-[#e3c8c5] bg-gradient-to-br from-[#fff8f6] to-[#f8e6e2] p-2">

          <div className="rounded-[15px] border border-white/80 bg-white/55 p-4">

            <div className="flex items-center justify-center gap-2">
              <PackageCheck
                size={14}
                className="text-[#84424f]"
              />

              <span className="text-[7px] font-bold uppercase tracking-[0.17em] text-[#9d727a]">
                Tracking Number
              </span>
            </div>

            <p className="mt-2 text-[15px] font-bold tracking-[0.08em] text-[#65353f]">
              {trackingNumber}
            </p>

            <button
              type="button"
              onClick={
                copyTracking
              }
              className="mt-3 inline-flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-[0.12em] text-[#84424f]"
            >
              {copied ? (
                <>
                  <Check
                    size={10}
                  />
                  Copied
                </>
              ) : (
                <>
                  <Copy
                    size={10}
                  />
                  Copy Number
                </>
              )}
            </button>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-7 flex flex-wrap justify-center gap-2">

          <Link
            to={`/track-order?tracking=${encodeURIComponent(
              trackingNumber
            )}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#793747] px-5 py-2.5 text-[7px] font-bold uppercase tracking-[0.13em] text-white"
          >
            Track Order
            <ArrowRight
              size={11}
            />
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center rounded-full border border-[#cda9aa] px-5 py-2.5 text-[7px] font-bold uppercase tracking-[0.13em] text-[#793747]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;