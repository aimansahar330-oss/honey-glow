import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (
    !Array.isArray(cartItems) ||
    cartItems.length === 0
  ) {
    return <EmptyCart />;
  }

  return (
    <main className="min-h-screen bg-[#fffdfb]">

      {/* =========================
          HEADER
      ========================= */}
      <section className="relative overflow-hidden border-b border-[#efdedb] bg-gradient-to-br from-[#fff8f5] via-[#fdf0ec] to-[#f7e2df] px-5 py-10 sm:px-8 lg:px-12 xl:px-16">

        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#edc8c7]/30 blur-3xl" />

        <div className="relative mx-auto max-w-[1450px]">

          <div className="mb-2 flex items-center gap-2">
            <Sparkles
              size={12}
              className="text-[#964654]"
            />

            <span className="text-[8px] font-bold uppercase tracking-[0.23em] text-[#9c6770]">
              Your HoneyGlow Bag
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h1 className="font-beauty text-[38px] font-semibold leading-none tracking-[-0.04em] text-[#43262c] sm:text-[46px]">
                Your little bag of
                <span className="ml-2 text-[#873d4c]">
                  glow.
                </span>
              </h1>

              <p className="mt-3 max-w-[450px] text-[10px] leading-5 text-[#806a6e] sm:text-[11px]">
                Review your selected care essentials
                before heading to checkout.
              </p>
            </div>

            <Link
              to="/products"
              className="group inline-flex w-fit items-center gap-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#81404c]"
            >
              <ArrowLeft size={12} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          CART CONTENT
      ========================= */}
      <section className="px-5 py-8 sm:px-8 lg:px-12 lg:py-10 xl:px-16">
        <div className="mx-auto grid max-w-[1450px] gap-6 lg:grid-cols-[1fr_330px] xl:grid-cols-[1fr_350px]">

          {/* =========================
              CART ITEMS
          ========================= */}
          <div>

            <div className="mb-4 flex items-center justify-between">
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#a2777e]">
                {cartItems.length}{" "}
                {cartItems.length === 1
                  ? "Product"
                  : "Products"}
              </p>

              <button
                type="button"
                onClick={clearCart}
                className="text-[7px] font-bold uppercase tracking-[0.13em] text-[#a44d5b] transition hover:text-red-500"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-3">
              {cartItems.map(
                (item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    updateQuantity={
                      updateQuantity
                    }
                    removeFromCart={
                      removeFromCart
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* =========================
              ORDER SUMMARY
          ========================= */}
          <aside className="lg:sticky lg:top-[95px] lg:self-start">

            <div className="overflow-hidden rounded-[24px] border border-[#e4c9c6] bg-gradient-to-b from-[#fff8f6] via-[#fdf1ee] to-[#f8e6e2] p-2 shadow-[0_14px_40px_rgba(80,44,53,0.08)]">

              <div className="rounded-[19px] border border-white/70 bg-white/55 p-5 backdrop-blur-sm">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-[#a17079]">
                      Order Summary
                    </p>

                    <h2 className="font-beauty mt-1 text-[26px] font-semibold text-[#4e3037]">
                      Almost yours.
                    </h2>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0d9d6] text-[#823e4b]">
                    <ShoppingBag
                      size={15}
                    />
                  </div>
                </div>

                {/* SUBTOTAL */}
                <div className="mt-6 space-y-3 border-y border-[#ead8d5] py-4">

                  <SummaryRow
                    title="Subtotal"
                    value={`Rs. ${Number(
                      subtotal
                    ).toLocaleString()}`}
                  />

                  <SummaryRow
                    title="Delivery"
                    value="Calculated at checkout"
                    small
                  />
                </div>

                {/* TOTAL */}
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-[#a07d84]">
                      Current Total
                    </p>

                    <p className="mt-1 text-[7px] text-[#a38d92]">
                      Before delivery charges
                    </p>
                  </div>

                  <p className="text-[16px] font-bold text-[#743643]">
                    Rs.{" "}
                    {Number(
                      subtotal
                    ).toLocaleString()}
                  </p>
                </div>

                {/* CHECKOUT */}
                <Link
                  to="/checkout"
                  className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#793747] py-3 text-[8px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_25px_rgba(121,55,71,0.2)] transition hover:bg-[#612b38]"
                >
                  Proceed to Checkout

                  <ArrowRight
                    size={12}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <p className="mt-3 text-center text-[6px] leading-4 text-[#a18c91]">
                  Delivery charges and final order total
                  will be confirmed at checkout.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* =====================================================
   CART ITEM
===================================================== */

function CartItem({
  item,
  updateQuantity,
  removeFromCart,
}) {
  const image =
    item.images?.[0]?.imageUrl;

  const finalPrice =
    Number(
      item.discountPrice ??
        item.originalPrice
    );

  const quantity =
    Number(item.quantity || 1);

  const stock =
    Number(item.stock || 0);

  const lineTotal =
    finalPrice * quantity;

  return (
    <article className="group overflow-hidden rounded-[22px] border border-[#e5cecb] bg-gradient-to-r from-[#fff9f7] via-[#fffdfb] to-[#faece9] p-2 shadow-[0_8px_25px_rgba(79,46,53,0.05)] transition hover:border-[#cf9ea4] hover:shadow-[0_12px_30px_rgba(79,46,53,0.09)]">

      <div className="grid grid-cols-[82px_1fr] gap-3 rounded-[17px] border border-white/70 bg-white/50 p-2.5 sm:grid-cols-[100px_1fr_auto] sm:items-center sm:p-3">

        {/* IMAGE */}
        <Link
          to={`/product/${item.slug}`}
          className="overflow-hidden rounded-[14px] border border-[#ead3d0] bg-[#f4e4e0]"
        >
          {image ? (
            <img
              src={image}
              alt={item.name}
              className="aspect-square h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="aspect-square bg-gradient-to-br from-[#f4d8d4] to-[#ead5a8]" />
          )}
        </Link>

        {/* DETAILS */}
        <div className="min-w-0">

          <p className="truncate text-[6px] font-bold uppercase tracking-[0.14em] text-[#a0777e]">
            {item.category?.name}
          </p>

          <Link
            to={`/product/${item.slug}`}
            className="font-beauty mt-1 block truncate text-[16px] font-semibold text-[#503138] transition hover:text-[#873d4c] sm:text-[18px]"
          >
            {item.name}
          </Link>

          {/* PRICE */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[9px] font-bold text-[#793744]">
              Rs.{" "}
              {finalPrice.toLocaleString()}
            </span>

            {item.discountPrice && (
              <span className="text-[7px] text-[#ae969b] line-through">
                Rs.{" "}
                {Number(
                  item.originalPrice
                ).toLocaleString()}
              </span>
            )}
          </div>

          {/* MOBILE QUANTITY */}
          <div className="mt-3 flex items-center justify-between sm:hidden">
            <QuantityControl
              quantity={quantity}
              stock={stock}
              decrease={() =>
                updateQuantity(
                  item.id,
                  quantity - 1
                )
              }
              increase={() =>
                updateQuantity(
                  item.id,
                  quantity + 1
                )
              }
            />

            <button
              type="button"
              onClick={() =>
                removeFromCart(
                  item.id
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-full border border-red-100 text-red-400 transition hover:bg-red-50"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden min-w-[145px] flex-col items-end sm:flex">

          <p className="text-[11px] font-bold text-[#70333f]">
            Rs.{" "}
            {lineTotal.toLocaleString()}
          </p>

          <div className="mt-3">
            <QuantityControl
              quantity={quantity}
              stock={stock}
              decrease={() =>
                updateQuantity(
                  item.id,
                  quantity - 1
                )
              }
              increase={() =>
                updateQuantity(
                  item.id,
                  quantity + 1
                )
              }
            />
          </div>

          <button
            type="button"
            onClick={() =>
              removeFromCart(
                item.id
              )
            }
            className="mt-3 inline-flex items-center gap-1.5 text-[6px] font-bold uppercase tracking-[0.12em] text-[#a7636e] transition hover:text-red-500"
          >
            <Trash2 size={10} />
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   QUANTITY
===================================================== */

function QuantityControl({
  quantity,
  stock,
  decrease,
  increase,
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-[#dfc7c4] bg-[#fff9f7] p-0.5">

      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= 1}
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#7b4650] transition hover:bg-[#f1dfdc] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus size={11} />
      </button>

      <span className="min-w-[26px] text-center text-[8px] font-bold text-[#593940]">
        {quantity}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={
          quantity >= stock
        }
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#7b4650] transition hover:bg-[#f1dfdc] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus size={11} />
      </button>
    </div>
  );
}

/* =====================================================
   SUMMARY ROW
===================================================== */

function SummaryRow({
  title,
  value,
  small = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[8px] text-[#81686d]">
        {title}
      </span>

      <span
        className={
          small
            ? "text-right text-[7px] font-semibold text-[#9d858a]"
            : "text-[9px] font-bold text-[#62434a]"
        }
      >
        {value}
      </span>
    </div>
  );
}

/* =====================================================
   EMPTY CART
===================================================== */

function EmptyCart() {
  return (
    <main className="flex min-h-[72vh] items-center justify-center bg-[#fffdfb] px-5 py-14">

      <div className="w-full max-w-[500px] text-center">

        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">

          <div className="absolute inset-0 rounded-full border border-[#dcbfc0]" />

          <div className="absolute inset-2 rounded-full border border-dashed border-[#e7ceca]" />

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e1dd] text-[#873f4d]">
            <ShoppingBag size={20} />
          </div>
        </div>

        <p className="mt-6 text-[7px] font-bold uppercase tracking-[0.22em] text-[#a06d76]">
          Your HoneyGlow Bag
        </p>

        <h1 className="font-beauty mt-2 text-[34px] font-semibold text-[#4b2d34] sm:text-[40px]">
          Your bag feels a little
          <span className="ml-2 text-[#893f4e]">
            empty.
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-[350px] text-[9px] leading-5 text-[#90777c]">
          Discover a few beautiful care essentials
          and bring a little more glow into your routine.
        </p>

        <Link
          to="/products"
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#793747] px-5 py-2.5 text-[8px] font-bold uppercase tracking-[0.13em] text-white transition hover:bg-[#612b38]"
        >
          Explore Products

          <ArrowRight
            size={12}
            className="transition group-hover:translate-x-1"
          />
        </Link>
      </div>
    </main>
  );
}

export default Cart;