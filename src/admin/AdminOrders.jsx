import {
  useMemo,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Eye,
  ImageIcon,
  Package,
  Search,
  ShoppingBag,
  Trash2,
  Truck,
  User,
  X,
  XCircle,
} from "lucide-react";

import {
  deleteAdminOrder,
  getAdminOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../services/orderApi";

function AdminOrders() {
  const queryClient =
    useQueryClient();

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL");

  const [
    paymentFilter,
    setPaymentFilter,
  ] = useState("ALL");

  const [
    selectedOrder,
    setSelectedOrder,
  ] = useState(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState(null);

  /* =========================
     GET ORDERS
  ========================= */

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "admin-orders",
      statusFilter,
      paymentFilter,
    ],

    queryFn: () =>
      getAdminOrders({
        status:
          statusFilter,

        paymentStatus:
          paymentFilter,
      }),
  });

  const orders =
    Array.isArray(data)
      ? data
      : [];

  /* =========================
     SEARCH
  ========================= */

  const filteredOrders =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return orders;
      }

      return orders.filter(
        (order) =>
          order.trackingNumber
            ?.toLowerCase()
            .includes(keyword) ||

          order.customerName
            ?.toLowerCase()
            .includes(keyword) ||

          order.phone
            ?.toLowerCase()
            .includes(keyword)
      );
    }, [
      orders,
      search,
    ]);

  /* =========================
     UPDATE ORDER STATUS
  ========================= */

  const statusMutation =
    useMutation({
      mutationFn:
        updateOrderStatus,

      onSuccess: async (
        response
      ) => {
        await queryClient.invalidateQueries({
          queryKey: [
            "admin-orders",
          ],
        });

        setSelectedOrder(
          (current) =>
            current
              ? {
                  ...current,

                  status:
                    response.data
                      .status,

                  paymentStatus:
                    response.data
                      .paymentStatus ??
                    current.paymentStatus,
                }
              : current
        );
      },
    });

  /* =========================
     UPDATE PAYMENT
  ========================= */

  const paymentMutation =
    useMutation({
      mutationFn:
        updatePaymentStatus,

      onSuccess: async (
        response
      ) => {
        await queryClient.invalidateQueries({
          queryKey: [
            "admin-orders",
          ],
        });

        setSelectedOrder(
          (current) =>
            current
              ? {
                  ...current,

                  paymentStatus:
                    response.data
                      .paymentStatus,
                }
              : current
        );
      },
    });

  /* =========================
     DELETE ORDER
  ========================= */

  const deleteMutation =
    useMutation({
      mutationFn:
        deleteAdminOrder,

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            "admin-orders",
          ],
        });

        setSelectedOrder(null);
        setDeleteTarget(null);
      },
    });

  return (
    <div>

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a86674]">
            Sales
          </p>

          <h1 className="font-beauty mt-1 text-4xl font-semibold text-[#45292f] dark:text-[#f5e8eb]">
            Orders
          </h1>

          <p className="mt-2 text-xs text-[#92777d] dark:text-[#a99297]">
            Manage customer orders,
            payments and delivery
            progress.
          </p>
        </div>

        <div className="rounded-xl border border-[#e4d3d0] bg-white px-4 py-2.5 dark:border-white/10 dark:bg-[#1b1518]">

          <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#9b737a]">
            Total Orders
          </p>

          <p className="mt-0.5 text-lg font-bold text-[#703542] dark:text-[#f0bbc5]">
            {orders.length}
          </p>
        </div>
      </div>

      {/* =========================
          FILTER BAR
      ========================= */}

      <div className="mb-5 rounded-[20px] border border-[#e8dad7] bg-white p-3 dark:border-white/10 dark:bg-[#1b1518]">

        <div className="grid gap-2.5 lg:grid-cols-[1fr_170px_190px]">

          {/* SEARCH */}
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
              placeholder="Search tracking, customer or phone..."
              className="w-full bg-transparent px-3 py-3 text-[10px] text-[#513c41] outline-none placeholder:text-[#b29ca1] dark:text-white"
            />
          </div>

          {/* STATUS FILTER */}
          <FilterSelect
            value={
              statusFilter
            }
            onChange={
              setStatusFilter
            }
            options={[
              [
                "ALL",
                "All Statuses",
              ],
              [
                "PENDING",
                "Pending",
              ],
              [
                "PROCESSING",
                "Processing",
              ],
              [
                "SHIPPED",
                "Shipped",
              ],
              [
                "DELIVERED",
                "Delivered",
              ],
              [
                "CANCELLED",
                "Cancelled",
              ],
            ]}
          />

          {/* PAYMENT FILTER */}
          <FilterSelect
            value={
              paymentFilter
            }
            onChange={
              setPaymentFilter
            }
            options={[
              [
                "ALL",
                "All Payments",
              ],
              [
                "PENDING_VERIFICATION",
                "Needs Verification",
              ],
              [
                "COD_PENDING",
                "COD Pending",
              ],
              [
                "PAID",
                "Paid",
              ],
              [
                "REJECTED",
                "Rejected",
              ],
            ]}
          />
        </div>
      </div>

      {/* =========================
          ORDERS
      ========================= */}

      {isLoading ? (
        <OrderSkeleton />
      ) : isError ? (
        <div className="rounded-[22px] border border-red-200 bg-red-50 p-8 text-center text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          Unable to load orders.
        </div>
      ) : filteredOrders.length ===
        0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-3">

          {filteredOrders.map(
            (order) => (
              <OrderRow
                key={
                  order.id
                }
                order={
                  order
                }
                onOpen={() =>
                  setSelectedOrder(
                    order
                  )
                }
                onDelete={() =>
                  setDeleteTarget(
                    order
                  )
                }
              />
            )
          )}
        </div>
      )}

      {/* =========================
          ORDER DETAILS MODAL
      ========================= */}

      {selectedOrder && (
        <OrderDetailsModal
          order={
            selectedOrder
          }
          onClose={() =>
            setSelectedOrder(
              null
            )
          }
          onDelete={() => {
            setSelectedOrder(
              null
            );

            setDeleteTarget(
              selectedOrder
            );
          }}
          statusMutation={
            statusMutation
          }
          paymentMutation={
            paymentMutation
          }
        />
      )}

      {/* =========================
          DELETE CONFIRMATION
      ========================= */}

      {deleteTarget && (
        <DeleteOrderModal
          order={
            deleteTarget
          }
          deleting={
            deleteMutation.isPending
          }
          error={
            deleteMutation.error
              ?.response?.data
              ?.message
          }
          onCancel={() => {
            setDeleteTarget(
              null
            );

            deleteMutation.reset();
          }}
          onDelete={() =>
            deleteMutation.mutate(
              deleteTarget.id
            )
          }
        />
      )}
    </div>
  );
}

/* ======================================
   ORDER ROW
====================================== */

function OrderRow({
  order,
  onOpen,
  onDelete,
}) {
  return (
    <article className="rounded-[20px] border border-[#e7d6d3] bg-white p-4 shadow-[0_7px_24px_rgba(73,42,49,0.04)] transition hover:border-[#cca6aa] hover:shadow-[0_10px_28px_rgba(73,42,49,0.08)] dark:border-white/10 dark:bg-[#1b1518]">

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* ORDER */}
          <div>
            <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-[#a58288]">
              Order
            </p>

            <p className="mt-1 text-[10px] font-bold text-[#623740] dark:text-[#eed2d8]">
              {order.trackingNumber}
            </p>

            <p className="mt-1 text-[8px] text-[#a38b90]">
              {formatDate(
                order.createdAt
              )}
            </p>
          </div>

          {/* CUSTOMER */}
          <div>
            <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-[#a58288]">
              Customer
            </p>

            <p className="mt-1 truncate text-[10px] font-semibold text-[#65434a] dark:text-[#e6ced3]">
              {order.customerName}
            </p>

            <p className="mt-1 text-[8px] text-[#a38b90]">
              {order.phone}
            </p>
          </div>

          {/* PAYMENT */}
          <div>
            <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-[#a58288]">
              Payment
            </p>

            <p className="mt-1 text-[9px] font-semibold text-[#70404a] dark:text-[#e4c2c9]">
              {paymentMethodLabel(
                order.paymentMethod
              )}
            </p>

            <div className="mt-1.5">
              <PaymentBadge
                status={
                  order.paymentStatus
                }
              />
            </div>
          </div>

          {/* TOTAL */}
          <div>
            <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-[#a58288]">
              Total
            </p>

            <p className="mt-1 text-[12px] font-bold text-[#733743] dark:text-[#efbfc8]">
              Rs.{" "}
              {Number(
                order.total
              ).toLocaleString()}
            </p>

            <div className="mt-1.5">
              <OrderStatusBadge
                status={
                  order.status
                }
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">

          {/* VIEW */}
          <button
            type="button"
            onClick={
              onOpen
            }
            className="flex h-9 items-center justify-center gap-2 rounded-xl border border-[#dbc0bd] px-4 text-[8px] font-bold uppercase tracking-[0.1em] text-[#783c48] transition hover:bg-[#f5e5e2] dark:border-white/10 dark:text-[#e1aeba] dark:hover:bg-white/5"
          >
            <Eye
              size={13}
            />

            View
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={
              onDelete
            }
            title="Delete order"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:text-white dark:border-red-500/20 dark:bg-red-500/10"
          >
            <Trash2
              size={14}
            />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ======================================
   ORDER DETAILS MODAL
====================================== */

function OrderDetailsModal({
  order,
  onClose,
  onDelete,
  statusMutation,
  paymentMutation,
}) {
  const walletPayment =
    order.paymentMethod ===
      "JAZZCASH" ||
    order.paymentMethod ===
      "EASYPAISA";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-[#29181d]/55 p-3 backdrop-blur-md sm:p-5"
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="max-h-[94vh] w-full max-w-[900px] overflow-y-auto rounded-[26px] border border-[#e2c8c5] bg-[#fffaf9] shadow-[0_30px_100px_rgba(42,22,28,0.3)] dark:border-white/10 dark:bg-[#181214]"
      >

        {/* HEADER */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#ead9d6] bg-[#fffaf9]/95 px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#181214]/95">

          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#a36d76]">
              Order Detail
            </p>

            <h2 className="font-beauty mt-1 text-[26px] font-semibold text-[#4d3037] dark:text-[#f3e1e5]">
              {order.trackingNumber}
            </h2>
          </div>

          <div className="flex items-center gap-2">

            {/* DELETE FROM DETAILS */}
            <button
              type="button"
              onClick={
                onDelete
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white dark:border-red-500/20 dark:bg-red-500/10"
              title="Delete Order"
            >
              <Trash2
                size={14}
              />
            </button>

            {/* CLOSE */}
            <button
              type="button"
              onClick={
                onClose
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1e2df] text-[#783e49] dark:bg-white/10 dark:text-white"
            >
              <X
                size={16}
              />
            </button>
          </div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_300px]">

          {/* LEFT */}
          <div className="space-y-5">

            {/* CUSTOMER */}
            <DetailSection
              icon={
                User
              }
              title="Customer Details"
            >
              <div className="grid gap-3 sm:grid-cols-2">

                <InfoItem
                  label="Name"
                  value={
                    order.customerName
                  }
                />

                <InfoItem
                  label="Phone"
                  value={
                    order.phone
                  }
                />

                <InfoItem
                  label="Email"
                  value={
                    order.email ||
                    "Not provided"
                  }
                />

                <InfoItem
                  label="City"
                  value={
                    order.city
                  }
                />
              </div>

              <InfoItem
                label="Address"
                value={
                  order.address
                }
                full
              />

              {order.notes && (
                <InfoItem
                  label="Notes"
                  value={
                    order.notes
                  }
                  full
                />
              )}
            </DetailSection>

            {/* ITEMS */}
            <DetailSection
              icon={
                ShoppingBag
              }
              title="Order Items"
            >
              <div className="space-y-3">

                {order.items?.map(
                  (item) => (
                    <div
                      key={
                        item.id
                      }
                      className="flex items-center gap-3 rounded-xl border border-[#ead9d6] bg-[#fff8f6] p-2.5 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f0dfdc]">

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
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon
                              size={
                                16
                              }
                              className="text-[#b9989e]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate font-beauty text-[15px] font-semibold text-[#57343c] dark:text-[#efdce0]">
                          {
                            item.productName
                          }
                        </p>

                        <p className="mt-0.5 text-[8px] text-[#9b8388]">
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>

                      <p className="text-[9px] font-bold text-[#743743] dark:text-[#edbbc5]">
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
            </DetailSection>

            {/* PAYMENT PROOF */}
            {walletPayment && (
              <DetailSection
                icon={
                  CircleDollarSign
                }
                title="Payment Verification"
              >

                <div className="grid gap-3 sm:grid-cols-2">

                  <InfoItem
                    label="Method"
                    value={paymentMethodLabel(
                      order.paymentMethod
                    )}
                  />

                  <InfoItem
                    label="Sender Number"
                    value={
                      order.paymentSenderNumber ||
                      "-"
                    }
                  />

                  <InfoItem
                    label="Transaction ID"
                    value={
                      order.paymentReference ||
                      "-"
                    }
                  />

                  <div>
                    <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#a07c83]">
                      Payment Status
                    </p>

                    <div className="mt-1.5">
                      <PaymentBadge
                        status={
                          order.paymentStatus
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* SCREENSHOT */}
                {order.paymentProofUrl && (
                  <div className="mt-4">

                    <p className="mb-2 text-[7px] font-bold uppercase tracking-[0.14em] text-[#a07c83]">
                      Payment Screenshot
                    </p>

                    <a
                      href={
                        order.paymentProofUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="block w-fit overflow-hidden rounded-[16px] border border-[#dfc6c3]"
                    >
                      <img
                        src={
                          order.paymentProofUrl
                        }
                        alt="Payment proof"
                        className="max-h-[280px] w-auto max-w-full object-contain"
                      />
                    </a>
                  </div>
                )}

                {/* PAYMENT ACTIONS */}
                {order.paymentStatus ===
                  "PENDING_VERIFICATION" && (
                  <div className="mt-4 flex flex-wrap gap-2">

                    <button
                      type="button"
                      disabled={
                        paymentMutation.isPending
                      }
                      onClick={() =>
                        paymentMutation.mutate(
                          {
                            id:
                              order.id,

                            paymentStatus:
                              "PAID",
                          }
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white disabled:opacity-50"
                    >
                      <Check
                        size={
                          12
                        }
                      />

                      Verify Payment
                    </button>

                    <button
                      type="button"
                      disabled={
                        paymentMutation.isPending
                      }
                      onClick={() =>
                        paymentMutation.mutate(
                          {
                            id:
                              order.id,

                            paymentStatus:
                              "REJECTED",
                          }
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white disabled:opacity-50"
                    >
                      <XCircle
                        size={
                          12
                        }
                      />

                      Reject
                    </button>
                  </div>
                )}
              </DetailSection>
            )}
          </div>

          {/* RIGHT */}
          <aside className="space-y-4">

            {/* SUMMARY */}
            <div className="rounded-[20px] border border-[#e3cbc7] bg-gradient-to-br from-[#fff8f6] to-[#f7e6e2] p-4 dark:border-white/10 dark:from-[#21181b] dark:to-[#1b1416]">

              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#a07179]">
                Order Summary
              </p>

              <div className="mt-4 space-y-3">

                <PriceRow
                  label="Subtotal"
                  value={
                    order.subtotal
                  }
                />

                <PriceRow
                  label="Delivery"
                  value={
                    order.deliveryCharge
                  }
                />

                <div className="border-t border-[#e6d1ce] pt-3 dark:border-white/10">

                  <div className="flex items-end justify-between">

                    <span className="text-[9px] font-bold text-[#72555c] dark:text-[#baa3a8]">
                      Total
                    </span>

                    <span className="text-[16px] font-bold text-[#713541] dark:text-[#efb9c4]">
                      Rs.{" "}
                      {Number(
                        order.total
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div className="rounded-[20px] border border-[#e3cbc7] bg-white p-4 dark:border-white/10 dark:bg-[#1b1518]">

              <div className="flex items-center gap-2">

                <Package
                  size={14}
                  className="text-[#864451]"
                />

                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#9c737b]">
                  Order Status
                </p>
              </div>

              <div className="mt-3">
                <OrderStatusBadge
                  status={
                    order.status
                  }
                />
              </div>

              <select
                value={
                  order.status
                }
                disabled={
                  statusMutation.isPending
                }
                onChange={(e) =>
                  statusMutation.mutate(
                    {
                      id:
                        order.id,

                      status:
                        e.target.value,
                    }
                  )
                }
                className="mt-4 w-full rounded-xl border border-[#dfcfcc] bg-[#fff9f7] px-3 py-2.5 text-[9px] font-semibold text-[#64444b] outline-none dark:border-white/10 dark:bg-[#120e10] dark:text-white"
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="PROCESSING">
                  Processing
                </option>

                <option value="SHIPPED">
                  Shipped
                </option>

                <option value="DELIVERED">
                  Delivered
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </div>

            {/* META */}
            <div className="rounded-[20px] border border-[#e3cbc7] bg-white p-4 dark:border-white/10 dark:bg-[#1b1518]">

              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#9c737b]">
                Order Info
              </p>

              <div className="mt-3 space-y-3">

                <MetaRow
                  icon={
                    Clock3
                  }
                  label="Placed"
                  value={formatDate(
                    order.createdAt
                  )}
                />

                <MetaRow
                  icon={
                    Truck
                  }
                  label="Payment"
                  value={paymentMethodLabel(
                    order.paymentMethod
                  )}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ======================================
   DELETE ORDER MODAL
====================================== */

function DeleteOrderModal({
  order,
  deleting,
  error,
  onCancel,
  onDelete,
}) {
  return (
    <div
      onClick={
        onCancel
      }
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#26171b]/65 p-4 backdrop-blur-md"
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="w-full max-w-[430px] overflow-hidden rounded-[25px] border border-[#ebcfcb] bg-[#fffaf9] p-2 shadow-[0_30px_90px_rgba(41,20,27,0.3)] dark:border-white/10 dark:bg-[#191315]"
      >

        <div className="rounded-[19px] border border-white/80 bg-white/60 p-5 dark:border-white/5 dark:bg-white/5">

          {/* ICON */}
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
            <Trash2
              size={18}
            />
          </div>

          <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.17em] text-red-500">
            Delete Order
          </p>

          <h2 className="font-beauty mt-1 text-[27px] font-semibold text-[#4e3037] dark:text-[#f2e0e4]">
            Delete this order?
          </h2>

          <p className="mt-3 text-[10px] leading-5 text-[#8c7479] dark:text-[#af999e]">
            Order{" "}
            <strong className="text-[#683c45] dark:text-[#e4c8ce]">
              {order.trackingNumber}
            </strong>{" "}
            will be permanently deleted.
          </p>

          {/* STOCK NOTE */}
          {order.status !==
            "DELIVERED" && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[9px] leading-4 text-amber-700">

              Product quantities from
              this order will be returned
              to stock because the order
              has not been delivered.
            </div>
          )}

          {/* DELIVERED WARNING */}
          {order.status ===
            "DELIVERED" && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-[9px] leading-4 text-red-600">

              This order is already
              delivered. Its product stock
              will not be changed.
            </div>
          )}

          {/* PAYMENT PROOF NOTE */}
          {order.paymentProofUrl && (
            <p className="mt-3 text-[9px] leading-4 text-[#977f84]">
              The uploaded payment
              screenshot will also be
              removed.
            </p>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-[9px] text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-6 flex justify-end gap-2">

            <button
              type="button"
              disabled={
                deleting
              }
              onClick={
                onCancel
              }
              className="rounded-xl border border-[#decac7] px-4 py-2.5 text-[9px] font-semibold text-[#705258] transition hover:bg-[#f7ecea] disabled:opacity-50 dark:border-white/10 dark:text-[#d0b9be] dark:hover:bg-white/5"
            >
              Keep Order
            </button>

            <button
              type="button"
              disabled={
                deleting
              }
              onClick={
                onDelete
              }
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-[9px] font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2
                size={
                  12
                }
              />

              {deleting
                ? "Deleting..."
                : "Delete Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================
   HELPERS
====================================== */

function DetailSection({
  icon: Icon,
  title,
  children,
}) {
  return (
    <section className="rounded-[20px] border border-[#e5d3d0] bg-white p-4 dark:border-white/10 dark:bg-[#1b1518]">

      <div className="mb-4 flex items-center gap-2">

        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f1dfdc] text-[#83424e] dark:bg-[#352328]">
          <Icon
            size={14}
          />
        </div>

        <h3 className="font-beauty text-[20px] font-semibold text-[#55333a] dark:text-[#eedce0]">
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}

function InfoItem({
  label,
  value,
  full = false,
}) {
  return (
    <div
      className={
        full
          ? "sm:col-span-2"
          : ""
      }
    >
      <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#a07c83]">
        {label}
      </p>

      <p className="mt-1 text-[9px] leading-5 text-[#60464c] dark:text-[#d7c2c7]">
        {value}
      </p>
    </div>
  );
}

function PriceRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-[9px] text-[#80686d] dark:text-[#a99398]">
        {label}
      </span>

      <span className="text-[9px] font-bold text-[#61434a] dark:text-[#d7bdc2]">
        Rs.{" "}
        {Number(
          value
        ).toLocaleString()}
      </span>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-2.5">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f2e2df] text-[#854550] dark:bg-[#332328]">
        <Icon
          size={11}
        />
      </div>

      <div>
        <p className="text-[7px] uppercase tracking-[0.12em] text-[#a07d84]">
          {label}
        </p>

        <p className="mt-0.5 text-[9px] font-semibold text-[#64464d] dark:text-[#d7c0c5]">
          {value}
        </p>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}) {
  return (
    <div className="relative">

      <select
        value={
          value
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="h-full min-h-[42px] w-full appearance-none rounded-xl border border-[#e4d2cf] bg-[#fcf8f7] px-3 pr-8 text-[8px] font-semibold text-[#72545b] outline-none dark:border-white/10 dark:bg-[#120e10] dark:text-white"
      >
        {options.map(
          ([
            optionValue,
            label,
          ]) => (
            <option
              key={
                optionValue
              }
              value={
                optionValue
              }
            >
              {label}
            </option>
          )
        )}
      </select>

      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9b777d]"
      />
    </div>
  );
}

function OrderStatusBadge({
  status,
}) {
  const styles = {
    PENDING:
      "bg-amber-50 text-amber-700 border-amber-200",

    PROCESSING:
      "bg-blue-50 text-blue-700 border-blue-200",

    SHIPPED:
      "bg-violet-50 text-violet-700 border-violet-200",

    DELIVERED:
      "bg-emerald-50 text-emerald-700 border-emerald-200",

    CANCELLED:
      "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.1em] ${
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
  const styles = {
    PAID:
      "bg-emerald-50 text-emerald-700 border-emerald-200",

    PENDING_VERIFICATION:
      "bg-amber-50 text-amber-700 border-amber-200",

    COD_PENDING:
      "bg-blue-50 text-blue-700 border-blue-200",

    REJECTED:
      "bg-red-50 text-red-600 border-red-200",
  };

  const labels = {
    PAID:
      "Paid",

    PENDING_VERIFICATION:
      "Verify Payment",

    COD_PENDING:
      "COD Pending",

    REJECTED:
      "Rejected",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.08em] ${
        styles[status] ||
        styles.COD_PENDING
      }`}
    >
      {labels[status] ||
        status}
    </span>
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
  ).toLocaleString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-[24px] border border-dashed border-[#ddc7c3] bg-white px-6 py-14 text-center dark:border-white/10 dark:bg-[#1b1518]">

      <Package
        size={25}
        className="mx-auto text-[#a35a67]"
      />

      <h2 className="font-beauty mt-4 text-2xl font-semibold">
        No orders found
      </h2>

      <p className="mt-2 text-[9px] text-[#9b8388]">
        New customer orders will
        appear here.
      </p>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="space-y-3">

      {Array.from({
        length: 5,
      }).map(
        (_, index) => (
          <div
            key={
              index
            }
            className="h-[110px] animate-pulse rounded-[20px] border border-[#e9dbd8] bg-white dark:border-white/10 dark:bg-[#1b1518]"
          />
        )
      )}
    </div>
  );
}

export default AdminOrders;