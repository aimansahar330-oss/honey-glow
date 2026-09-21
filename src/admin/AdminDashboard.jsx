import {
  ArrowUpRight,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  Link,
} from "react-router-dom";

import {
  getAdminDashboard,
} from "../services/dashboardApi";

function AdminDashboard() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "admin-dashboard",
    ],

    queryFn:
      getAdminDashboard,
  });

  if (isLoading) {
    return (
      <DashboardSkeleton />
    );
  }

  if (
    isError ||
    !data
  ) {
    return (
      <div className="rounded-[22px] border border-red-200 bg-red-50 p-8 text-center text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
        Unable to load dashboard.
      </div>
    );
  }

  const stats = [
    {
      title: "Revenue",

      value: `Rs. ${Number(
        data.stats?.revenue ||
          0
      ).toLocaleString()}`,

      subtitle:
        "Delivered sales",

      icon:
        TrendingUp,
    },

    {
      title: "Orders",

      value:
        data.stats?.orders ||
        0,

      subtitle:
        "All orders",

      icon:
        ShoppingBag,
    },

    {
      title: "Products",

      value:
        data.stats?.products ||
        0,

      subtitle:
        "Active products",

      icon:
        Package,
    },

    {
      title: "Customers",

      value:
        data.stats?.customers ||
        0,

      subtitle:
        "Guest buyers",

      icon:
        Users,
    },
  ];

  const salesOverview =
    Array.isArray(
      data.salesOverview
    )
      ? data.salesOverview
      : [];

  const recentOrders =
    Array.isArray(
      data.recentOrders
    )
      ? data.recentOrders
      : [];

  return (
    <div>

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a96a77]">
            Overview
          </p>

          <h1 className="font-beauty mt-1 text-4xl font-semibold text-[#45292f] dark:text-[#f5e8eb]">
            Good to see you.
          </h1>

          <p className="mt-2 text-xs text-[#92777d] dark:text-[#a99297]">
            Here's what's happening
            with HoneyGlow.
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#793747] px-4 py-3 text-[10px] font-semibold text-white transition hover:bg-[#622c39]"
        >
          View Store

          <ArrowUpRight
            size={14}
          />
        </Link>
      </div>

      {/* =========================
          STATS
      ========================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map(
          (item) => {
            const Icon =
              item.icon;

            return (
              <div
                key={
                  item.title
                }
                className="rounded-[22px] border border-[#e8dad7] bg-white p-5 shadow-[0_8px_28px_rgba(71,42,48,0.05)] dark:border-white/10 dark:bg-[#1b1518]"
              >

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#a08389]">
                      {item.title}
                    </p>

                    <p className="mt-3 text-2xl font-bold text-[#4a3036] dark:text-white">
                      {item.value}
                    </p>

                    <p className="mt-1 text-[9px] text-[#a0888d]">
                      {
                        item.subtitle
                      }
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e4e1] text-[#8d4554] dark:bg-[#352128] dark:text-[#e3a8b5]">

                    <Icon
                      size={18}
                    />
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* =========================
          BOTTOM
      ========================= */}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.45fr_1fr]">

        {/* =========================
            SALES OVERVIEW
        ========================= */}

        <div className="rounded-[24px] border border-[#e8dad7] bg-white p-5 dark:border-white/10 dark:bg-[#1b1518] sm:p-6">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#93616b]">
              Sales Overview
            </p>

            <p className="mt-1 text-[9px] text-[#a28a8f]">
              Delivered sales from
              the last 7 days.
            </p>
          </div>

          <SalesOverview
            sales={
              salesOverview
            }
          />
        </div>

        {/* =========================
            RECENT ORDERS
        ========================= */}

        <div className="rounded-[24px] border border-[#e8dad7] bg-white p-5 dark:border-white/10 dark:bg-[#1b1518] sm:p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#93616b]">
                Recent Orders
              </p>

              <p className="mt-1 text-[9px] text-[#a28a8f]">
                Latest customer orders.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#864451]"
            >
              View All
            </Link>
          </div>

          {recentOrders.length ===
          0 ? (
            <div className="flex min-h-[230px] items-center justify-center">

              <div className="text-center">

                <ShoppingBag
                  size={22}
                  className="mx-auto text-[#c3a7ac]"
                />

                <p className="mt-3 text-[9px] text-[#a38d92]">
                  No orders yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-2.5">

              {recentOrders.map(
                (order) => (
                  <RecentOrder
                    key={
                      order.id
                    }
                    order={
                      order
                    }
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================
   SALES OVERVIEW
======================================== */

function SalesOverview({
  sales,
}) {
  if (
    !Array.isArray(sales) ||
    sales.length === 0
  ) {
    return (
      <div className="flex h-[240px] items-center justify-center text-[9px] text-[#aa9297]">
        No sales data yet.
      </div>
    );
  }

  const maxAmount =
    Math.max(
      ...sales.map(
        (item) =>
          Number(
            item.amount || 0
          )
      ),
      1
    );

  const total =
    sales.reduce(
      (sum, item) =>
        sum +
        Number(
          item.amount || 0
        ),
      0
    );

  return (
    <div className="mt-5">

      {/* TOTAL */}
      <div>
        <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#aa858c]">
          7 Day Revenue
        </p>

        <p className="mt-1 text-[20px] font-bold text-[#66343f] dark:text-[#f0bdc7]">
          Rs.{" "}
          {Number(
            total
          ).toLocaleString()}
        </p>
      </div>

      {/* BAR GRAPH */}
      <div className="mt-6 flex h-[170px] items-end gap-2 border-b border-[#ecdfdc] pb-1 sm:gap-3 dark:border-white/10">

        {sales.map(
          (item) => {
            const amount =
              Number(
                item.amount ||
                  0
              );

            const percentage =
              amount > 0
                ? Math.max(
                    8,
                    (amount /
                      maxAmount) *
                      100
                  )
                : 3;

            return (
              <div
                key={
                  item.date
                }
                className="flex h-full min-w-0 flex-1 flex-col justify-end"
              >

                <div className="group relative flex h-full items-end">

                  {/* TOOLTIP */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#513039] px-2 py-1 text-[7px] text-white group-hover:block">

                    Rs.{" "}
                    {amount.toLocaleString()}
                  </div>

                  <div
                    className="w-full rounded-t-[8px] bg-gradient-to-t from-[#793747] to-[#c77c88] transition duration-300 hover:opacity-80"
                    style={{
                      height: `${percentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 truncate text-center text-[7px] font-medium text-[#9d858a]">
                  {formatShortDay(
                    item.date
                  )}
                </p>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

/* ========================================
   RECENT ORDER
======================================== */

function RecentOrder({
  order,
}) {
  return (
    <Link
      to="/admin/orders"
      className="flex items-center gap-3 rounded-[14px] border border-[#eee2df] bg-[#fdf9f8] p-3 transition hover:border-[#d7b9b7] hover:bg-[#fff7f5] dark:border-white/5 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
    >

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f2dfdc] text-[#85434f] dark:bg-[#35242a] dark:text-[#e8b1bc]">

        <ShoppingBag
          size={14}
        />
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-center justify-between gap-2">

          <p className="truncate text-[9px] font-bold text-[#5f3a42] dark:text-[#ead5da]">
            {
              order.customerName
            }
          </p>

          <p className="shrink-0 text-[9px] font-bold text-[#713541] dark:text-[#eebac4]">
            Rs.{" "}
            {Number(
              order.total
            ).toLocaleString()}
          </p>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">

          <p className="truncate text-[7px] text-[#a28b90]">
            {
              order.trackingNumber
            }
          </p>

          <OrderStatus
            status={
              order.status
            }
          />
        </div>
      </div>
    </Link>
  );
}

/* ========================================
   STATUS
======================================== */

function OrderStatus({
  status,
}) {
  const styles = {
    PENDING:
      "bg-amber-50 text-amber-700",

    PROCESSING:
      "bg-blue-50 text-blue-700",

    SHIPPED:
      "bg-violet-50 text-violet-700",

    DELIVERED:
      "bg-emerald-50 text-emerald-700",

    CANCELLED:
      "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[6px] font-bold uppercase tracking-[0.07em] ${
        styles[status] ||
        styles.PENDING
      }`}
    >
      {status}
    </span>
  );
}

/* ========================================
   HELPERS
======================================== */

function formatShortDay(
  date
) {
  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(
    "en-PK",
    {
      weekday: "short",
    }
  );
}

/* ========================================
   SKELETON
======================================== */

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">

      <div className="mb-8">
        <div className="h-3 w-20 rounded bg-[#eadbd8]" />

        <div className="mt-3 h-10 w-64 rounded bg-[#eee1de]" />

        <div className="mt-3 h-3 w-52 rounded bg-[#f1e7e4]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {Array.from({
          length: 4,
        }).map(
          (_, index) => (
            <div
              key={
                index
              }
              className="h-[140px] rounded-[22px] border border-[#e8dad7] bg-white dark:border-white/10 dark:bg-[#1b1518]"
            />
          )
        )}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.45fr_1fr]">

        <div className="h-[330px] rounded-[24px] border border-[#e8dad7] bg-white dark:border-white/10 dark:bg-[#1b1518]" />

        <div className="h-[330px] rounded-[24px] border border-[#e8dad7] bg-white dark:border-white/10 dark:bg-[#1b1518]" />
      </div>
    </div>
  );
}

export default AdminDashboard;