import {
  useMemo,
  useState,
} from "react";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  Search,
  Users,
} from "lucide-react";

import {
  getAdminCustomers,
} from "../services/customerApi";

function AdminCustomers() {
  const [search, setSearch] =
    useState("");

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "admin-customers",
    ],

    queryFn:
      getAdminCustomers,
  });

  const customers =
    Array.isArray(data)
      ? data
      : [];

  const filteredCustomers =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return customers;
      }

      return customers.filter(
        (customer) =>
          customer.name
            ?.toLowerCase()
            .includes(keyword) ||

          customer.phone
            ?.toLowerCase()
            .includes(keyword) ||

          customer.email
            ?.toLowerCase()
            .includes(keyword) ||

          customer.city
            ?.toLowerCase()
            .includes(keyword)
      );
    }, [
      customers,
      search,
    ]);

  return (
    <div>

      {/* HEADER */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a86674]">
            Customers
          </p>

          <h1 className="font-beauty mt-1 text-4xl font-semibold text-[#45292f] dark:text-[#f5e8eb]">
            Customer List
          </h1>

          <p className="mt-2 text-xs text-[#92777d] dark:text-[#a99297]">
            Customers who have placed
            orders on HoneyGlow.
          </p>
        </div>

        <div className="rounded-xl border border-[#e4d3d0] bg-white px-4 py-2.5 dark:border-white/10 dark:bg-[#1b1518]">

          <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#9b737a]">
            Total Customers
          </p>

          <p className="mt-0.5 text-lg font-bold text-[#703542] dark:text-[#f0bbc5]">
            {customers.length}
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-5 rounded-[18px] border border-[#e8dad7] bg-white p-3 dark:border-white/10 dark:bg-[#1b1518]">

        <div className="flex items-center rounded-xl border border-[#e6d8d5] bg-[#fcf8f7] px-3 dark:border-white/10 dark:bg-[#120e10]">

          <Search
            size={14}
            className="text-[#9e747c]"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search name, phone, email or city..."
            className="w-full bg-transparent px-3 py-3 text-[10px] text-[#513c41] outline-none placeholder:text-[#b29ca1] dark:text-white"
          />
        </div>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <CustomerSkeleton />
      ) : isError ? (
        <div className="rounded-[20px] border border-red-200 bg-red-50 p-8 text-center text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          Unable to load customers.
        </div>
      ) : filteredCustomers.length ===
        0 ? (
        <EmptyCustomers />
      ) : (
        <div className="overflow-hidden rounded-[20px] border border-[#e7d7d4] bg-white dark:border-white/10 dark:bg-[#1b1518]">

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto md:block">

            <table className="w-full">

              <thead className="border-b border-[#eadbd8] bg-[#fcf7f6] dark:border-white/10 dark:bg-[#151012]">

                <tr>
                  <TableHead>
                    Customer
                  </TableHead>

                  <TableHead>
                    Contact
                  </TableHead>

                  <TableHead>
                    City
                  </TableHead>

                  <TableHead>
                    Orders
                  </TableHead>

                  <TableHead>
                    Total Spent
                  </TableHead>

                  <TableHead>
                    Last Order
                  </TableHead>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map(
                  (
                    customer,
                    index
                  ) => (
                    <CustomerRow
                      key={`${customer.phone}-${index}`}
                      customer={
                        customer
                      }
                    />
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="divide-y divide-[#eadbd8] md:hidden dark:divide-white/10">

            {filteredCustomers.map(
              (
                customer,
                index
              ) => (
                <MobileCustomer
                  key={`${customer.phone}-${index}`}
                  customer={
                    customer
                  }
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =================================
   DESKTOP ROW
================================= */

function CustomerRow({
  customer,
}) {
  return (
    <tr className="border-b border-[#f0e6e4] transition last:border-0 hover:bg-[#fffaf9] dark:border-white/5 dark:hover:bg-white/[0.02]">

      {/* CUSTOMER */}
      <td className="px-4 py-4">

        <div className="flex items-center gap-3">

          <CustomerAvatar
            name={
              customer.name
            }
          />

          <div>
            <p className="text-[10px] font-semibold text-[#5f3d44] dark:text-[#ead6da]">
              {customer.name}
            </p>

            <p className="mt-0.5 text-[8px] text-[#a08a8f]">
              Guest Customer
            </p>
          </div>
        </div>
      </td>

      {/* CONTACT */}
      <td className="px-4 py-4">

        <p className="text-[9px] font-medium text-[#684950] dark:text-[#d8c2c7]">
          {customer.phone}
        </p>

        <p className="mt-1 max-w-[180px] truncate text-[8px] text-[#a28a8f]">
          {customer.email ||
            "No email"}
        </p>
      </td>

      {/* CITY */}
      <td className="px-4 py-4 text-[9px] text-[#72585e] dark:text-[#c7afb4]">
        {customer.city}
      </td>

      {/* ORDERS */}
      <td className="px-4 py-4">

        <span className="inline-flex min-w-[30px] items-center justify-center rounded-full bg-[#f2dfdc] px-2 py-1 text-[8px] font-bold text-[#7b3b47] dark:bg-[#362429] dark:text-[#edbdc6]">
          {customer.totalOrders}
        </span>
      </td>

      {/* TOTAL SPENT */}
      <td className="px-4 py-4 text-[10px] font-bold text-[#713541] dark:text-[#efb9c4]">
        Rs.{" "}
        {Number(
          customer.totalSpent
        ).toLocaleString()}
      </td>

      {/* LAST ORDER */}
      <td className="px-4 py-4 text-[8px] text-[#927b80] dark:text-[#ae989d]">
        {formatDate(
          customer.lastOrderAt
        )}
      </td>
    </tr>
  );
}

/* =================================
   MOBILE CARD
================================= */

function MobileCustomer({
  customer,
}) {
  return (
    <div className="p-4">

      <div className="flex items-start gap-3">

        <CustomerAvatar
          name={
            customer.name
          }
        />

        <div className="min-w-0 flex-1">

          <p className="truncate text-[11px] font-semibold text-[#5f3d44] dark:text-[#ead6da]">
            {customer.name}
          </p>

          <p className="mt-1 text-[9px] text-[#80666c] dark:text-[#bea7ac]">
            {customer.phone}
          </p>

          <p className="mt-0.5 truncate text-[8px] text-[#a18a8f]">
            {customer.email ||
              "No email"}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">

            <MobileInfo
              label="City"
              value={
                customer.city
              }
            />

            <MobileInfo
              label="Orders"
              value={
                customer.totalOrders
              }
            />

            <MobileInfo
              label="Total Spent"
              value={`Rs. ${Number(
                customer.totalSpent
              ).toLocaleString()}`}
            />

            <MobileInfo
              label="Last Order"
              value={formatDate(
                customer.lastOrderAt
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================================
   HELPERS
================================= */

function CustomerAvatar({
  name,
}) {
  const letter =
    name?.trim()?.charAt(0)
      ?.toUpperCase() ||
    "C";

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#dfc2c0] bg-gradient-to-br from-[#f6dfdc] to-[#ecd0cf] text-[11px] font-bold text-[#7b3b47] dark:border-white/10 dark:from-[#38262b] dark:to-[#2d2024] dark:text-[#edbbc4]">
      {letter}
    </div>
  );
}

function MobileInfo({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-[#fcf6f5] px-3 py-2 dark:bg-white/5">

      <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-[#a17d84]">
        {label}
      </p>

      <p className="mt-1 truncate text-[9px] font-semibold text-[#67474e] dark:text-[#d6bdc3]">
        {value}
      </p>
    </div>
  );
}

function TableHead({
  children,
}) {
  return (
    <th className="px-4 py-3 text-left text-[7px] font-bold uppercase tracking-[0.15em] text-[#987279]">
      {children}
    </th>
  );
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

function EmptyCustomers() {
  return (
    <div className="rounded-[22px] border border-dashed border-[#ddc7c3] bg-white px-6 py-14 text-center dark:border-white/10 dark:bg-[#1b1518]">

      <Users
        size={25}
        className="mx-auto text-[#a35a67]"
      />

      <h2 className="font-beauty mt-4 text-2xl font-semibold text-[#503039] dark:text-[#f0dce1]">
        No customers yet
      </h2>

      <p className="mt-2 text-[9px] text-[#9b8388]">
        Customers will appear here
        after they place an order.
      </p>
    </div>
  );
}

function CustomerSkeleton() {
  return (
    <div className="space-y-2">

      {Array.from({
        length: 6,
      }).map(
        (_, index) => (
          <div
            key={index}
            className="h-[75px] animate-pulse rounded-[18px] border border-[#e9dbd8] bg-white dark:border-white/10 dark:bg-[#1b1518]"
          />
        )
      )}
    </div>
  );
}

export default AdminCustomers;