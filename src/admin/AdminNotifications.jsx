import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Bell,
  CheckCheck,
  CreditCard,
  Package,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  deleteAdminNotification,
  getAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationApi";

function AdminNotifications() {
  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const panelRef =
    useRef(null);

  const [open, setOpen] =
    useState(false);

  /* =========================================
     GET NOTIFICATIONS
  ========================================= */

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: [
      "admin-notifications",
    ],

    queryFn:
      getAdminNotifications,

    /*
      Har 30 sec mein latest notifications.
      WebSocket abhi zaroori nahi.
    */
    refetchInterval: 30000,

    /*
      Bell open karte hi stale data
      automatically refresh ho sake.
    */
    staleTime: 10000,
  });

  const notifications =
    Array.isArray(
      data?.notifications
    )
      ? data.notifications
      : [];

  const unreadCount =
    Number(
      data?.unreadCount ?? 0
    );

  /* =========================================
     MARK ONE AS READ
  ========================================= */

  const readMutation =
    useMutation({
      mutationFn:
        markNotificationRead,

      onSuccess: (
        _response,
        notificationId
      ) => {
        /*
          UI instantly update.
          Refetch ka wait nahi.
        */
        queryClient.setQueryData(
          [
            "admin-notifications",
          ],
          (old) => {
            if (!old) {
              return old;
            }

            const oldNotifications =
              Array.isArray(
                old.notifications
              )
                ? old.notifications
                : [];

            const target =
              oldNotifications.find(
                (item) =>
                  item.id ===
                  notificationId
              );

            const wasUnread =
              target &&
              !target.isRead;

            return {
              ...old,

              unreadCount:
                Math.max(
                  0,
                  Number(
                    old.unreadCount ??
                      0
                  ) -
                    (wasUnread
                      ? 1
                      : 0)
                ),

              notifications:
                oldNotifications.map(
                  (item) =>
                    item.id ===
                    notificationId
                      ? {
                          ...item,
                          isRead:
                            true,
                        }
                      : item
                ),
            };
          }
        );
      },

      onSettled: () => {
        /*
          Backend aur frontend ko
          final sync mein rakho.
        */
        queryClient.invalidateQueries({
          queryKey: [
            "admin-notifications",
          ],
        });
      },
    });

  /* =========================================
     MARK ALL AS READ
  ========================================= */

  const readAllMutation =
    useMutation({
      mutationFn:
        markAllNotificationsRead,

      onSuccess: () => {
        queryClient.setQueryData(
          [
            "admin-notifications",
          ],
          (old) => {
            if (!old) {
              return old;
            }

            return {
              ...old,

              unreadCount: 0,

              notifications:
                Array.isArray(
                  old.notifications
                )
                  ? old.notifications.map(
                      (item) => ({
                        ...item,
                        isRead:
                          true,
                      })
                    )
                  : [],
            };
          }
        );
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "admin-notifications",
          ],
        });
      },
    });

  /* =========================================
     DELETE NOTIFICATION
  ========================================= */

  const deleteMutation =
    useMutation({
      mutationFn:
        deleteAdminNotification,

      onSuccess: (
        _response,
        notificationId
      ) => {
        queryClient.setQueryData(
          [
            "admin-notifications",
          ],
          (old) => {
            if (!old) {
              return old;
            }

            const oldNotifications =
              Array.isArray(
                old.notifications
              )
                ? old.notifications
                : [];

            const target =
              oldNotifications.find(
                (item) =>
                  item.id ===
                  notificationId
              );

            const wasUnread =
              target &&
              !target.isRead;

            return {
              ...old,

              unreadCount:
                Math.max(
                  0,
                  Number(
                    old.unreadCount ??
                      0
                  ) -
                    (wasUnread
                      ? 1
                      : 0)
                ),

              notifications:
                oldNotifications.filter(
                  (item) =>
                    item.id !==
                    notificationId
                ),
            };
          }
        );
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "admin-notifications",
          ],
        });
      },
    });

  /* =========================================
     OUTSIDE CLICK
  ========================================= */

  useEffect(() => {
    const handleOutsideClick =
      (event) => {
        if (
          panelRef.current &&
          !panelRef.current.contains(
            event.target
          )
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================================
     ESC KEY
  ========================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape =
      (event) => {
        if (
          event.key ===
          "Escape"
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  /* =========================================
     OPEN NOTIFICATION
  ========================================= */

  const handleOpenNotification =
    async (
      notification
    ) => {
      if (
        !notification.isRead
      ) {
        try {
          await readMutation.mutateAsync(
            notification.id
          );
        } catch (error) {
          console.error(
            "Unable to mark notification as read:",
            error
          );
        }
      }

      if (
        notification.link
      ) {
        navigate(
          notification.link
        );

        setOpen(false);
      }
    };

  /* =========================================
     TOGGLE PANEL
  ========================================= */

  const handleToggle = () => {
    setOpen(
      (current) =>
        !current
    );
  };

  return (
    <div
      ref={panelRef}
      className="relative"
    >
      {/* =====================================
          BELL BUTTON
      ===================================== */}

      <button
        type="button"
        onClick={
          handleToggle
        }
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2cecb] bg-white text-[#78404b] shadow-[0_5px_18px_rgba(76,42,50,0.05)] transition duration-300 hover:bg-[#f7e9e6] dark:border-white/10 dark:bg-[#1c1618] dark:text-[#eab5bf] dark:hover:bg-white/5"
        aria-label={`Notifications${
          unreadCount > 0
            ? `, ${unreadCount} unread`
            : ""
        }`}
      >
        <Bell
          size={18}
        />

        {/* NUMERIC BADGE */}
        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-2
              -top-2
              z-20
              flex
              h-[21px]
              min-w-[21px]
              items-center
              justify-center
              rounded-full
              border-2
              border-white
              bg-[#e55265]
              px-1
              text-[9px]
              font-extrabold
              leading-none
              text-white
              shadow-[0_3px_8px_rgba(180,45,65,0.35)]
              dark:border-[#171113]
            "
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* =====================================
          NOTIFICATION PANEL
      ===================================== */}

      {open && (
        <div
          className="
            fixed
            inset-x-3
            top-[72px]
            z-[200]
            max-h-[calc(100vh-88px)]
            overflow-hidden
            rounded-[22px]
            border
            border-[#e5d1ce]
            bg-[#fffaf9]
            shadow-[0_25px_80px_rgba(48,24,31,0.25)]
            dark:border-white/10
            dark:bg-[#181214]

            sm:absolute
            sm:inset-auto
            sm:right-0
            sm:top-[calc(100%+10px)]
            sm:w-[400px]
            sm:max-h-[540px]
          "
        >
          {/* =================================
              HEADER
          ================================= */}

          <div className="flex items-center justify-between border-b border-[#eadbd8] px-4 py-3.5 dark:border-white/10">

            <div className="min-w-0">

              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#a36d77]">
                HoneyGlow
              </p>

              <div className="mt-0.5 flex flex-wrap items-center gap-2">

                <h3 className="font-beauty text-[21px] font-semibold text-[#4e3037] dark:text-[#f1dce1]">
                  Notifications
                </h3>

                {unreadCount >
                  0 && (
                  <span className="rounded-full bg-[#f1ddda] px-2 py-0.5 text-[8px] font-bold text-[#843f4d] dark:bg-[#38252a] dark:text-[#edbbc5]">

                    {
                      unreadCount
                    }{" "}

                    {unreadCount === 1
                      ? "unread"
                      : "unread"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">

              {/* MARK ALL READ */}
              {unreadCount >
                0 && (
                <button
                  type="button"
                  disabled={
                    readAllMutation.isPending
                  }
                  onClick={() =>
                    readAllMutation.mutate()
                  }
                  title="Mark all as read"
                  aria-label="Mark all notifications as read"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#814550] transition hover:bg-[#f3e4e1] disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#e6aeb9] dark:hover:bg-white/5"
                >
                  <CheckCheck
                    size={15}
                  />
                </button>
              )}

              {/* CLOSE */}
              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                aria-label="Close notifications"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#814550] transition hover:bg-[#f3e4e1] sm:hidden dark:text-[#e6aeb9] dark:hover:bg-white/5"
              >
                <X
                  size={15}
                />
              </button>
            </div>
          </div>

          {/* =================================
              CONTENT
          ================================= */}

          <div className="max-h-[calc(100vh-155px)] overflow-y-auto overscroll-contain sm:max-h-[440px]">

            {isLoading ? (
              <NotificationSkeleton />
            ) : notifications.length ===
              0 ? (
              <EmptyNotifications />
            ) : (
              <div className="divide-y divide-[#eee1de] dark:divide-white/5">

                {notifications.map(
                  (
                    notification
                  ) => (
                    <NotificationItem
                      key={
                        notification.id
                      }
                      notification={
                        notification
                      }
                      onOpen={() =>
                        handleOpenNotification(
                          notification
                        )
                      }
                      onDelete={() =>
                        deleteMutation.mutate(
                          notification.id
                        )
                      }
                      deleting={
                        deleteMutation.isPending &&
                        deleteMutation.variables ===
                          notification.id
                      }
                      reading={
                        readMutation.isPending &&
                        readMutation.variables ===
                          notification.id
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* =================================
              FOOTER
          ================================= */}

          {notifications.length >
            0 && (
            <div className="border-t border-[#eadbd8] bg-[#fff7f5] px-4 py-2.5 text-center dark:border-white/10 dark:bg-white/[0.02]">

              <p className="text-[7px] text-[#a18a8f]">
                Showing latest{" "}
                {notifications.length}{" "}
                notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================
   NOTIFICATION ITEM
========================================= */

function NotificationItem({
  notification,
  onOpen,
  onDelete,
  deleting,
  reading,
}) {
  const {
    icon: Icon,
    iconClass,
  } = getNotificationStyle(
    notification.type
  );

  return (
    <div
      className={`group relative flex items-start gap-3 px-3.5 py-3.5 transition sm:px-4 ${
        notification.isRead
          ? "bg-transparent"
          : "bg-[#fff5f3] dark:bg-[#2a1d20]/50"
      }`}
    >
      {/* UNREAD INDICATOR */}
      {!notification.isRead && (
        <span className="absolute left-1 top-[18px] h-1.5 w-1.5 rounded-full bg-[#a84456] sm:left-1.5" />
      )}

      {/* ICON */}
      <button
        type="button"
        disabled={
          reading
        }
        onClick={
          onOpen
        }
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition disabled:opacity-50 ${iconClass}`}
      >
        <Icon
          size={14}
        />
      </button>

      {/* BODY */}
      <button
        type="button"
        disabled={
          reading
        }
        onClick={
          onOpen
        }
        className="min-w-0 flex-1 text-left disabled:opacity-60"
      >
        <div className="flex items-start justify-between gap-2">

          <p
            className={`line-clamp-1 text-[10px] text-[#5f3b43] dark:text-[#ead5da] ${
              notification.isRead
                ? "font-semibold"
                : "font-bold"
            }`}
          >
            {
              notification.title
            }
          </p>

          <span className="shrink-0 pt-0.5 text-[7px] text-[#ae979b]">
            {formatTimeAgo(
              notification.createdAt
            )}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-[#8d7479] dark:text-[#bba5aa]">
          {
            notification.message
          }
        </p>

        {!notification.isRead && (
          <p className="mt-1.5 text-[7px] font-bold uppercase tracking-[0.1em] text-[#98505c] dark:text-[#e2a9b3]">
            New
          </p>
        )}
      </button>

      {/* DELETE
          Mobile: always visible
          Desktop: hover par visible
      */}
      <button
        type="button"
        disabled={
          deleting
        }
        onClick={(event) => {
          event.stopPropagation();

          onDelete();
        }}
        title="Delete notification"
        aria-label="Delete notification"
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-red-100
          bg-red-50
          text-red-400
          opacity-100
          transition
          duration-200
          hover:bg-red-500
          hover:text-white
          disabled:cursor-not-allowed
          disabled:opacity-40

          sm:opacity-0
          sm:group-hover:opacity-100
          sm:focus:opacity-100

          dark:border-red-500/20
          dark:bg-red-500/10
          dark:text-red-300
        "
      >
        <Trash2
          size={12}
        />
      </button>
    </div>
  );
}

/* =========================================
   NOTIFICATION TYPE
========================================= */

function getNotificationStyle(
  type
) {
  if (
    type ===
    "PAYMENT_VERIFICATION"
  ) {
    return {
      icon:
        CreditCard,

      iconClass:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    };
  }

  if (
    type ===
    "LOW_STOCK"
  ) {
    return {
      icon:
        Package,

      iconClass:
        "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300",
    };
  }

  return {
    icon:
      ShoppingBag,

    iconClass:
      "bg-[#f0dedb] text-[#85414e] dark:bg-[#38252a] dark:text-[#ecb6c0]",
  };
}

/* =========================================
   EMPTY STATE
========================================= */

function EmptyNotifications() {
  return (
    <div className="flex min-h-[230px] items-center justify-center px-5 py-8">

      <div className="text-center">

        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#f1e0dd] text-[#884451] dark:bg-[#352429] dark:text-[#e6aeba]">

          <Bell
            size={17}
          />
        </div>

        <p className="font-beauty mt-3 text-[19px] font-semibold text-[#55353c] dark:text-[#edd9dd]">
          All caught up
        </p>

        <p className="mt-1 text-[8px] text-[#9d858a]">
          No notifications right now.
        </p>
      </div>
    </div>
  );
}

/* =========================================
   SKELETON
========================================= */

function NotificationSkeleton() {
  return (
    <div className="space-y-1 p-3">

      {Array.from({
        length: 5,
      }).map(
        (_, index) => (
          <div
            key={
              index
            }
            className="h-[74px] animate-pulse rounded-xl bg-[#f2e5e2] dark:bg-white/5"
          />
        )
      )}
    </div>
  );
}

/* =========================================
   TIME AGO
========================================= */

function formatTimeAgo(
  value
) {
  if (!value) {
    return "";
  }

  const time =
    new Date(
      value
    ).getTime();

  if (
    Number.isNaN(time)
  ) {
    return "";
  }

  const now =
    Date.now();

  const seconds =
    Math.max(
      0,
      Math.floor(
        (now - time) /
          1000
      )
    );

  if (
    seconds < 60
  ) {
    return "Now";
  }

  const minutes =
    Math.floor(
      seconds / 60
    );

  if (
    minutes < 60
  ) {
    return `${minutes}m`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (
    hours < 24
  ) {
    return `${hours}h`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  if (
    days < 7
  ) {
    return `${days}d`;
  }

  return new Date(
    value
  ).toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
    }
  );
}

export default AdminNotifications;