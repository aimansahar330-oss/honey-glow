import {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import AdminNotifications from "./AdminNotifications";

import {
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  ShoppingBag,
  Sun,
  Tags,
  Users,
  X,
} from "lucide-react";

/* =====================================================
   MENU ITEMS
===================================================== */

const menuItems = [
  {
    name: "Overview",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },

  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },

  {
    name: "Categories",
    path: "/admin/categories",
    icon: Tags,
  },

  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },

  {
    name: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
];

/* =====================================================
   ADMIN LAYOUT
===================================================== */

function AdminLayout() {
  const navigate =
    useNavigate();

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    darkMode,
    setDarkMode,
  ] = useState(() => {
    return (
      localStorage.getItem(
        "honeyglow_admin_theme"
      ) === "dark"
    );
  });

  const admin = JSON.parse(
    localStorage.getItem(
      "honeyglow_admin"
    ) || "{}"
  );

  /* ===================================================
     DARK MODE
  =================================================== */

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "honeyglow_admin_theme",
      darkMode
        ? "dark"
        : "light"
    );
  }, [darkMode]);

  /* ===================================================
     LOGOUT
  =================================================== */

  const logout = () => {
    localStorage.removeItem(
      "honeyglow_admin_token"
    );

    localStorage.removeItem(
      "honeyglow_admin"
    );

    navigate(
      "/admin-login"
    );
  };

  const adminName =
    admin?.name ||
    "Admin";

  const adminInitial =
    adminName
      ?.charAt(0)
      ?.toUpperCase() ||
    "A";

  return (
    <div className="min-h-screen bg-[#f8f3f1] text-[#432f34] transition-colors dark:bg-[#110d0f] dark:text-[#f6eaec]">

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(
              false
            )
          }
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[265px] flex-col border-r border-[#eadbd8] bg-[#fffaf8] transition-transform duration-300 dark:border-white/10 dark:bg-[#181315] ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* SIDEBAR HEADER */}

        <div className="flex h-[82px] items-center justify-between border-b border-[#eee1df] px-5 dark:border-white/10">

          <div className="flex items-center gap-2">

            <img
              src="/logo.png"
              alt="HoneyGlow"
              className="h-11 w-11 object-contain"
            />

            <div>

              <p className="font-beauty text-[22px] font-semibold text-[#67313d] dark:text-[#f0cbd3]">
                Glow
              </p>

              <p className="text-[6px] font-bold uppercase tracking-[0.2em] text-[#a78389]">
                Admin Studio
              </p>
            </div>
          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(
                false
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[#f2e5e2] lg:hidden dark:hover:bg-white/5"
          >
            <X
              size={18}
            />
          </button>
        </div>

        {/* =================================================
            SIDEBAR MENU
        ================================================= */}

        <div className="px-4 py-5">

          <p className="mb-3 px-3 text-[7px] font-bold uppercase tracking-[0.2em] text-[#b08b91]">
            Workspace
          </p>

          <nav className="space-y-1.5">

            {menuItems.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <NavLink
                    key={
                      item.path
                    }
                    to={
                      item.path
                    }
                    end={
                      item.end
                    }
                    onClick={() =>
                      setSidebarOpen(
                        false
                      )
                    }
                    className={({
                      isActive,
                    }) =>
                      `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[11px] font-semibold transition ${
                        isActive
                          ? "bg-[#793747] text-white shadow-[0_8px_22px_rgba(121,55,71,0.18)]"
                          : "text-[#725c61] hover:bg-[#f4e8e5] dark:text-[#baa5aa] dark:hover:bg-white/5"
                      }`
                    }
                  >
                    <Icon
                      size={
                        16
                      }
                    />

                    {
                      item.name
                    }
                  </NavLink>
                );
              }
            )}
          </nav>
        </div>

        {/* =================================================
            SIDEBAR BOTTOM
        ================================================= */}

        <div className="mt-auto p-4">

          <div className="rounded-[15px] bg-[#f3e5e1] p-3.5 dark:bg-[#241b1e]">

            <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-[#9f6873]">
              HoneyGlow
            </p>

            <p className="font-beauty mt-1 text-[18px] text-[#623640] dark:text-[#eccbd2]">
              Beauty, managed beautifully.
            </p>
          </div>

          <button
            type="button"
            onClick={
              logout
            }
            className="mt-2.5 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[11px] font-semibold text-[#8c4654] transition hover:bg-[#f4e8e5] dark:hover:bg-white/5"
          >
            <LogOut
              size={16}
            />

            Sign Out
          </button>
        </div>
      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="lg:pl-[265px]">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="sticky top-0 z-30 flex h-[68px] items-center border-b border-[#e9dcda] bg-[#f8f3f1]/90 px-3 backdrop-blur-xl sm:h-[72px] sm:px-5 lg:h-[76px] lg:px-9 dark:border-white/10 dark:bg-[#110d0f]/90">

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(
                true
              )
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#e3d4d1] bg-white lg:hidden dark:border-white/10 dark:bg-[#1c1618]"
          >
            <Menu
              size={17}
            />
          </button>

          {/* DESKTOP TITLE */}

          <div className="hidden lg:block">

            <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#ab8289]">
              HoneyGlow Administration
            </p>
          </div>

          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2">

            {/* ===============================================
                DARK MODE
            =============================================== */}

            <button
              type="button"
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              aria-label="Toggle dark mode"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#e3d4d1] bg-white text-[#71535a] transition hover:bg-[#f4e7e4] sm:h-10 sm:w-10 sm:rounded-xl dark:border-white/10 dark:bg-[#1c1618] dark:text-[#ecdfe2]"
            >
              {darkMode ? (
                <Sun
                  size={16}
                />
              ) : (
                <Moon
                  size={16}
                />
              )}
            </button>

            {/* ===============================================
                NOTIFICATIONS

                IMPORTANT:
                AdminNotifications apna button khud banata hai.
                Isko kisi aur button ke andar nahi rakhna.
            =============================================== */}

            <AdminNotifications />

            {/* ===============================================
                ADMIN PROFILE

                MOBILE PAR BHI NAME SHOW HOGA
            =============================================== */}

            <div
              className="
                ml-0.5
                flex
                min-w-0
                items-center
                gap-1.5
                rounded-[10px]
                border
                border-[#e3d4d1]
                bg-white
                px-1.5
                py-1.5

                sm:ml-1
                sm:gap-2.5
                sm:rounded-xl
                sm:px-2.5

                dark:border-white/10
                dark:bg-[#1c1618]
              "
            >

              {/* ADMIN INITIAL */}

              <div
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-[7px]
                  bg-[#ead3d7]
                  font-beauty
                  text-[15px]
                  font-bold
                  text-[#773848]

                  sm:h-8
                  sm:w-8
                  sm:rounded-lg
                  sm:text-lg

                  dark:bg-[#63303d]
                  dark:text-white
                "
              >
                {
                  adminInitial
                }
              </div>

              {/* ADMIN NAME
                  MOBILE PAR HIDDEN NAHI HAI
              */}

              <div className="min-w-0 pr-1 sm:pr-2">

                <p
                  className="
                    max-w-[65px]
                    truncate
                    text-[8px]
                    font-semibold
                    leading-tight

                    min-[380px]:max-w-[85px]
                    min-[380px]:text-[9px]

                    sm:max-w-[130px]
                    sm:text-[10px]
                  "
                  title={
                    adminName
                  }
                >
                  {
                    adminName
                  }
                </p>

                <p
                  className="
                    mt-0.5
                    max-w-[65px]
                    truncate
                    text-[5px]
                    uppercase
                    tracking-[0.05em]
                    text-[#a2878d]

                    min-[380px]:max-w-[85px]
                    min-[380px]:text-[6px]

                    sm:max-w-[130px]
                    sm:text-[8px]
                    sm:normal-case
                    sm:tracking-normal
                  "
                >
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="p-3 sm:p-6 lg:p-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;