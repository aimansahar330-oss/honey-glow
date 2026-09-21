import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import {
  useCart,
} from "../context/CartContext";

/* =====================================================
   NAV LINKS
===================================================== */

const links = [
  {
    title: "Home",
    path: "/",
  },

  {
    title: "Shop",
    path: "/products",
  },

  {
    title: "Categories",
    path: "/categories",
  },

  {
    title: "About",
    path: "/about",
  },

  {
    title: "Contact",
    path: "/contact",
  },
];

/* =====================================================
   NAVBAR
===================================================== */

function Navbar() {
  const navigate =
    useNavigate();

  const [
    mobileMenu,
    setMobileMenu,
  ] = useState(false);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const {
    itemCount,
  } = useCart();

  /* ===================================================
     MOBILE BODY SCROLL
  =================================================== */

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [mobileMenu]);

  /* ===================================================
     SEARCH
  =================================================== */

  const handleSearch = (
    event
  ) => {
    event.preventDefault();

    const query =
      searchTerm.trim();

    /*
      Empty search:
      just open all products
    */
    if (!query) {
      navigate(
        "/products"
      );

      setSearchOpen(
        false
      );

      setMobileMenu(
        false
      );

      return;
    }

    /*
      Product search query
    */
    navigate(
      `/products?search=${encodeURIComponent(
        query
      )}`
    );

    setSearchOpen(
      false
    );

    setMobileMenu(
      false
    );
  };

  const closeSearch = () => {
    setSearchOpen(
      false
    );
  };

  return (
    <>
      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-[#decac7]/80 bg-[#f8efec]/95 shadow-[0_5px_28px_rgba(101,52,60,0.07)] backdrop-blur-xl">

        <div className="relative mx-auto flex h-[82px] max-w-[1500px] items-center justify-between px-4 sm:h-[88px] sm:px-7 lg:px-10 xl:px-14">

          {/* =================================================
              BRAND
          ================================================= */}

          <Link
            to="/"
            onClick={() => {
              setSearchOpen(
                false
              );

              setMobileMenu(
                false
              );
            }}
            className="group flex shrink-0 items-center"
          >

            {/* LOGO */}

            <div className="relative flex h-[64px] w-[74px] items-center justify-center sm:h-[72px] sm:w-[84px]">

              <div className="absolute inset-2 rounded-full bg-[#ecd8d4]/70 opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />

              <img
                src="/logo.png"
                alt="HoneyGlow"
                className="relative z-10 h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]"
              />
            </div>

            {/* GLOW */}

            <div className="-ml-1 flex flex-col justify-center">

              <div className="relative inline-flex w-fit items-center">

                <span className="font-beauty bg-gradient-to-r from-[#6c2c38] via-[#9d4556] to-[#c8707e] bg-clip-text text-[23px] font-semibold italic leading-none tracking-[0.06em] text-transparent sm:text-[26px]">
                  Glow
                </span>

                <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#b85969] to-transparent" />

                <span className="absolute -right-2 -top-1 h-1.5 w-1.5 rounded-full bg-[#c77481]" />
              </div>

              <span className="mt-2 whitespace-nowrap text-[5px] font-semibold uppercase tracking-[0.23em] text-[#9f747a] sm:text-[6px]">
                Pure Care. Naturally You.
              </span>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAV
          ================================================= */}

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full border border-[#dfcdca] bg-white/70 p-1.5 shadow-[0_6px_24px_rgba(89,46,54,0.07)] backdrop-blur-lg lg:flex">

            {links.map(
              (link) => (
                <NavLink
                  key={
                    link.path
                  }
                  to={
                    link.path
                  }
                  end={
                    link.path ===
                    "/"
                  }
                  className={({
                    isActive,
                  }) =>
                    `relative rounded-full px-4 py-2.5 text-[12px] font-semibold tracking-[0.01em] transition-all duration-300 xl:px-5 ${
                      isActive
                        ? "bg-[#efdcd8] text-[#702e3a] shadow-[0_3px_12px_rgba(121,55,67,0.09)]"
                        : "text-[#554245] hover:bg-[#f5e6e3] hover:text-[#7a3542]"
                    }`
                  }
                >
                  {
                    link.title
                  }
                </NavLink>
              )
            )}
          </nav>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex items-center gap-1.5 sm:gap-2.5">

            {/* ===============================================
                DESKTOP SEARCH
            =============================================== */}

            <div className="relative hidden md:block">

              <form
                onSubmit={
                  handleSearch
                }
                className={`flex items-center overflow-hidden rounded-full border bg-white/75 transition-all duration-300 ${
                  searchOpen
                    ? "w-[250px] border-[#d7bbb7] shadow-[0_5px_20px_rgba(89,46,54,0.07)]"
                    : "w-11 border-transparent"
                }`}
              >

                {searchOpen && (
                  <input
                    type="text"
                    autoFocus
                    value={
                      searchTerm
                    }
                    onChange={(
                      event
                    ) =>
                      setSearchTerm(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Search products..."
                    className="min-w-0 flex-1 bg-transparent py-2.5 pl-4 text-[12px] text-[#47373a] outline-none placeholder:text-[#a88f92]"
                  />
                )}

                {searchOpen ? (
                  <>
                    {/* SEARCH SUBMIT */}

                    <button
                      type="submit"
                      aria-label="Search products"
                      className="flex h-11 w-10 shrink-0 items-center justify-center text-[#7d3543] transition hover:bg-[#efdfdc]"
                    >
                      <Search
                        size={
                          17
                        }
                        strokeWidth={
                          1.8
                        }
                      />
                    </button>

                    {/* CLOSE */}

                    <button
                      type="button"
                      aria-label="Close search"
                      onClick={
                        closeSearch
                      }
                      className="flex h-11 w-10 shrink-0 items-center justify-center text-[#8c5961] transition hover:bg-[#efdfdc]"
                    >
                      <X
                        size={
                          16
                        }
                        strokeWidth={
                          1.8
                        }
                      />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    aria-label="Open search"
                    onClick={() =>
                      setSearchOpen(
                        true
                      )
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#554245] transition hover:bg-[#efdfdc] hover:text-[#7d3543]"
                  >
                    <Search
                      size={
                        19
                      }
                      strokeWidth={
                        1.7
                      }
                    />
                  </button>
                )}
              </form>
            </div>

            {/* ===============================================
                MOBILE SEARCH BUTTON
            =============================================== */}

            <button
              type="button"
              aria-label="Search products"
              onClick={() => {
                setSearchOpen(
                  (
                    current
                  ) =>
                    !current
                );

                setMobileMenu(
                  false
                );
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dfceca] bg-white/75 text-[#554245] shadow-sm transition hover:bg-[#edddda] md:hidden"
            >

              {searchOpen ? (
                <X
                  size={18}
                  strokeWidth={
                    1.8
                  }
                />
              ) : (
                <Search
                  size={18}
                  strokeWidth={
                    1.7
                  }
                />
              )}
            </button>

            {/* ===============================================
                CART
            =============================================== */}

            <Link
              to="/cart"
              aria-label="Shopping cart"
              onClick={() =>
                setSearchOpen(
                  false
                )
              }
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#dfceca] bg-white/75 text-[#554245] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#d2b5b1] hover:bg-[#edddda] hover:text-[#7d3543] sm:h-11 sm:w-11"
            >

              <ShoppingBag
                size={19}
                strokeWidth={
                  1.7
                }
              />

              {itemCount >
                0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[#f8efec] bg-[#963a4c] px-1 text-[9px] font-bold text-white">

                  {itemCount >
                  99
                    ? "99+"
                    : itemCount}
                </span>
              )}
            </Link>

            {/* ===============================================
                MOBILE MENU
            =============================================== */}

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => {
                setMobileMenu(
                  true
                );

                setSearchOpen(
                  false
                );
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dfceca] bg-white/75 text-[#554245] shadow-sm transition hover:bg-[#edddda] lg:hidden"
            >
              <Menu
                size={21}
                strokeWidth={
                  1.7
                }
              />
            </button>
          </div>

          {/* =================================================
              MOBILE SEARCH BAR
          ================================================= */}

          {searchOpen && (
            <div className="absolute left-4 right-4 top-[74px] z-50 md:hidden sm:left-7 sm:right-7 sm:top-[80px]">

              <form
                onSubmit={
                  handleSearch
                }
                className="flex items-center rounded-2xl border border-[#d9bfbb] bg-[#fffaf8]/95 px-3 shadow-[0_12px_35px_rgba(82,45,51,0.15)] backdrop-blur-xl"
              >

                {/* SEARCH SUBMIT */}

                <button
                  type="submit"
                  aria-label="Search products"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#8e525c] transition hover:bg-[#f2dfdc]"
                >
                  <Search
                    size={17}
                  />
                </button>

                {/* INPUT */}

                <input
                  type="text"
                  autoFocus
                  value={
                    searchTerm
                  }
                  onChange={(
                    event
                  ) =>
                    setSearchTerm(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Search products..."
                  className="w-full bg-transparent px-2 py-3.5 text-[13px] text-[#49383b] outline-none placeholder:text-[#a99194]"
                />

                {/* CLOSE */}

                <button
                  type="button"
                  aria-label="Close search"
                  onClick={
                    closeSearch
                  }
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8c5961] transition hover:bg-[#f2dfdc]"
                >
                  <X
                    size={16}
                  />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      <div
        onClick={() =>
          setMobileMenu(
            false
          )
        }
        className={`fixed inset-0 z-[90] bg-[#352326]/30 backdrop-blur-[3px] transition-all duration-300 lg:hidden ${
          mobileMenu
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* =================================================
          MOBILE DRAWER
      ================================================= */}

      <aside
        className={`fixed right-0 top-0 z-[100] flex h-full w-[86%] max-w-[360px] flex-col bg-[#fffaf9] shadow-[-15px_0_50px_rgba(63,38,43,0.13)] transition-transform duration-500 ease-out lg:hidden ${
          mobileMenu
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        {/* ===============================================
            MOBILE HEADER
        =============================================== */}

        <div className="flex items-center justify-between border-b border-[#e7d6d3] px-5 py-4">

          {/* MOBILE BRAND */}

          <Link
            to="/"
            onClick={() =>
              setMobileMenu(
                false
              )
            }
            className="flex items-center"
          >

            <div className="relative flex h-[64px] w-[74px] items-center justify-center">

              <img
                src="/logo.png"
                alt="HoneyGlow"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="ml-0.5 flex flex-col justify-center">

              <div className="relative inline-flex w-fit items-center">

                <span className="font-beauty bg-gradient-to-r from-[#6c2c38] via-[#9d4556] to-[#c8707e] bg-clip-text text-[23px] font-semibold italic leading-none tracking-[0.06em] text-transparent">
                  Glow
                </span>

                <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#b85969] to-transparent" />

                <span className="absolute -right-2 -top-1 h-1.5 w-1.5 rounded-full bg-[#c77481]" />
              </div>

              <span className="mt-2 whitespace-nowrap text-[5px] font-semibold uppercase tracking-[0.18em] text-[#9f747a]">
                Pure Care. Naturally You.
              </span>
            </div>
          </Link>

          {/* CLOSE */}

          <button
            type="button"
            aria-label="Close menu"
            onClick={() =>
              setMobileMenu(
                false
              )
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0dfdc] text-[#743641] transition active:scale-95"
          >
            <X
              size={20}
            />
          </button>
        </div>

        {/* ===============================================
            MOBILE NAV
        =============================================== */}

        <nav className="mt-6 flex flex-col px-5">

          {links.map(
            (
              link,
              index
            ) => (
              <NavLink
                key={
                  link.path
                }
                to={
                  link.path
                }
                end={
                  link.path ===
                  "/"
                }
                onClick={() =>
                  setMobileMenu(
                    false
                  )
                }
                className={({
                  isActive,
                }) =>
                  `group flex items-center justify-between border-b border-[#f0e4e2] py-[17px] text-[14px] font-semibold transition-all duration-300 ${
                    isActive
                      ? "pl-3 text-[#8c3d4b]"
                      : "text-[#554346] hover:pl-3 hover:text-[#8c3d4b]"
                  }`
                }
              >
                {({
                  isActive,
                }) => (
                  <>
                    <div className="flex items-center gap-3">

                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-semibold ${
                          isActive
                            ? "bg-[#f4ddda] text-[#8c3d4b]"
                            : "bg-[#faf1ef] text-[#b58b90]"
                        }`}
                      >
                        0
                        {index +
                          1}
                      </span>

                      <span>
                        {
                          link.title
                        }
                      </span>
                    </div>

                    <span
                      className={`h-1.5 w-1.5 rounded-full transition ${
                        isActive
                          ? "bg-[#9b4c5c]"
                          : "bg-[#dfc9c7] group-hover:bg-[#9b4c5c]"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* ===============================================
            MOBILE BOTTOM
        =============================================== */}

        <div className="mt-auto p-5">

          <div className="relative overflow-hidden rounded-2xl bg-[#f5e5e2] px-5 py-5">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#ebd2cd]/70" />

            <p className="relative text-[9px] font-bold uppercase tracking-[0.18em] text-[#a0666f]">
              HoneyGlow
            </p>

            <p className="relative mt-2 font-serif text-[20px] leading-tight text-[#513b3e]">
              Your everyday
              <br />
              natural glow.
            </p>

            <Link
              to="/products"
              onClick={() =>
                setMobileMenu(
                  false
                )
              }
              className="relative mt-4 inline-flex rounded-full bg-[#7d3744] px-4 py-2 text-[10px] font-semibold text-white"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navbar;