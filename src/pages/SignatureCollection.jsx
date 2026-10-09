import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  Crown,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { getSignatureProducts } from "../services/signatureProductApi";
import { useCart } from "../context/CartContext";

function SignatureCollection() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["signature-products"],
    queryFn: getSignatureProducts,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const products =
    Array.isArray(data)
      ? data
      : [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#fffaf8]">
        <section className="border-b border-[#eddddf] bg-[#fffaf8] px-4 py-8 sm:px-6 sm:py-10 lg:px-9">
          <div className="mx-auto max-w-[1400px] text-center">
            <div className="mx-auto h-4 w-32 animate-pulse rounded-full bg-[#efe2e4]" />

            <div className="mx-auto mt-3 h-10 w-72 animate-pulse rounded-xl bg-[#eee1e2]" />
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-9 lg:py-14">
          <div className="mx-auto grid max-w-[1400px] gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 8,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-[430px] animate-pulse rounded-[28px] bg-[#f1e6e5]"
                />
              )
            )}
          </div>
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fffaf8] px-4">
        <div className="text-center">
          <p className="font-beauty text-[30px] font-semibold text-[#573b42]">
            Signature Collection
          </p>

          <p className="mt-2 text-[10px] text-[#987f85]">
            Unable to load signature products.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fbf4f3] to-[#fffaf8]">
      {/* =========================================
          SIMPLE PAGE HEADING
      ========================================== */}

      <section className="border-b border-[#eddddf] bg-[#fffaf8] px-4 py-8 sm:px-6 sm:py-10 lg:px-9">
        <div className="mx-auto max-w-[1400px] text-center">
          <div className="flex items-center justify-center gap-2">
            <Crown
              size={11}
              className="text-[#ad6572]"
            />

            <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-[#aa737d] sm:text-[8px]">
              KM Cares Signature
            </p>
          </div>

          <h1 className="font-beauty mt-2 text-[32px] font-semibold tracking-[-0.04em] text-[#53383f] sm:text-[40px] lg:text-[46px]">
            Signature
            <span className="ml-2 text-[#b86877]">
              Collection
            </span>
          </h1>

          <div className="mx-auto mt-3 h-px w-16 bg-[#c98994]" />
        </div>
      </section>

      {/* =========================================
          PRODUCTS
      ========================================== */}

      <section className="px-4 py-10 sm:px-6 lg:px-9 lg:py-14">
        <div className="mx-auto max-w-[1400px]">
          {products.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-[#dfced1] bg-white px-6 py-16 text-center">
              <Crown
                size={22}
                className="mx-auto text-[#b17984]"
              />

              <h2 className="font-beauty mt-3 text-[28px] font-semibold text-[#573b42]">
                Collection coming soon.
              </h2>

              <p className="mt-2 text-[9px] text-[#9b858a]">
                Signature products will appear here once added.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map(
                (product) => (
                  <SignatureProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* =====================================================
   SIGNATURE PRODUCT CARD
===================================================== */

function SignatureProductCard({
  product,
}) {
  const {
    addToCart,
  } = useCart();

  const [
    added,
    setAdded,
  ] = useState(false);

  const image =
    product.images?.[0]?.imageUrl ||
    null;

  const finalPrice =
    product.discountPrice ??
    product.originalPrice;

  const stock =
    Number(product.stock || 0);

  const originalPrice =
    Number(
      product.originalPrice || 0
    );

  const discountPrice =
    product.discountPrice
      ? Number(
          product.discountPrice
        )
      : null;

  const discountPercent =
    discountPrice &&
    originalPrice > 0
      ? Math.round(
          ((originalPrice -
            discountPrice) /
            originalPrice) *
            100
        )
      : 0;

  const handleAddToCart = () => {
    if (stock <= 0) {
      return;
    }

    addToCart(
      {
        ...product,
        productType:
          "SIGNATURE",
      },
      1
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-[#eadbdd] bg-[#fffdfb] shadow-[0_18px_55px_rgba(100,68,75,0.08)] transition duration-500 hover:-translate-y-2 hover:border-[#dabcc1] hover:shadow-[0_30px_75px_rgba(100,68,75,0.14)]">
      {/* =====================================
          IMAGE
      ====================================== */}

      <div className="relative h-[285px] overflow-hidden bg-gradient-to-br from-[#f7eded] via-[#fffaf8] to-[#eee2e8]">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#f0dcdf] via-[#fff8f5] to-[#eadfea]" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#4e3037]/25 via-transparent to-transparent" />

        {/* SIGNATURE BADGE */}

        {product.isPrimary && (
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/30 bg-[#5f3d46]/75 px-3 py-1.5 text-[6px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
            <Sparkles size={8} />
            Primary Signature
          </span>
        )}

        {/* DISCOUNT */}

        {discountPercent > 0 && (
          <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-[#a75b69]/90 px-2.5 py-1.5 text-[6px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-md">
            {discountPercent}% Off
          </span>
        )}

        {/* BOTTOM LABEL */}

        <div className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-[#fffaf8]/85 px-3 py-1.5 backdrop-blur-md">
          <p className="text-[5px] font-bold uppercase tracking-[0.15em] text-[#81515a]">
            KM Cares Signature
          </p>
        </div>
      </div>

      {/* =====================================
          DETAILS
      ====================================== */}

      <div className="p-5">
        <p className="text-[6px] font-bold uppercase tracking-[0.18em] text-[#ab7c84]">
          Signature Essential
        </p>

        <h2 className="font-beauty mt-2 line-clamp-2 text-[26px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#53383f]">
          {product.name}
        </h2>

        {/* DESCRIPTION */}

        <p className="mt-3 line-clamp-2 min-h-[40px] text-[9px] leading-5 text-[#907b80]">
          {product.shortDescription ||
            "A premium KM Cares signature essential created for elevated everyday care."}
        </p>

        {/* DIVIDER */}

        <div className="mt-4 h-px bg-gradient-to-r from-[#d8b9bd] via-[#eee1df] to-transparent" />

        {/* PRICE */}

        <div className="mt-4">
          <p className="text-[6px] font-bold uppercase tracking-[0.15em] text-[#ad9599]">
            Signature Price
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-[20px] font-black text-[#88424f]">
              Rs.{" "}
              {Number(
                finalPrice
              ).toLocaleString()}
            </span>

            {product.discountPrice && (
              <span className="text-[9px] text-[#b4a0a4] line-through">
                Rs.{" "}
                {Number(
                  product.originalPrice
                ).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* STOCK */}

        <div className="mt-3 flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              stock > 0
                ? "bg-emerald-500"
                : "bg-red-400"
            }`}
          />

          <span
            className={`text-[7px] font-bold uppercase tracking-[0.12em] ${
              stock > 0
                ? "text-[#8b777c]"
                : "text-red-400"
            }`}
          >
            {stock > 0
              ? `${stock} Available`
              : "Out of Stock"}
          </span>
        </div>

        {/* =====================================
            ADD TO CART
        ====================================== */}

        <button
          type="button"
          disabled={
            stock <= 0 ||
            added
          }
          onClick={
            handleAddToCart
          }
          className={`group/button mt-5 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[7px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_10px_25px_rgba(121,55,71,0.18)] transition duration-300 ${
            added
              ? "bg-emerald-500"
              : "bg-[#803a47] hover:-translate-y-0.5 hover:bg-[#914f5c]"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {added ? (
            <>
              <Check
                size={12}
              />

              Added to Cart
            </>
          ) : stock <= 0 ? (
            <>
              <ShoppingBag
                size={11}
              />

              Out of Stock
            </>
          ) : (
            <>
              <ShoppingBag
                size={11}
              />

              Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export default SignatureCollection;