import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import TrackOrder from "./pages/TrackOrder";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";

import ScrollToTop from "./components/ScrollToTop";

// ADMIN
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";
import AdminCategories from "./admin/AdminCategories";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminCustomers from "./admin/AdminCustomers";

/* =========================
   PUBLIC LAYOUT
========================= */

function PublicLayout() {
  return (
    <>
      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
}

/* =========================
   TEMPORARY PAGE
========================= */

function TemporaryPage({ title }) {
  return (
    <main className="min-h-[65vh] bg-[#fffaf7] px-6 py-20 text-center">
      <h1 className="font-beauty text-5xl font-semibold text-[#48262c]">
        {title}
      </h1>

      <p className="mt-3 text-sm text-neutral-500">
        HoneyGlow page is being built.
      </p>
    </main>
  );
}

/* =========================
   APP
========================= */

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        {/* =========================
            PUBLIC WEBSITE
        ========================= */}

        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/products"
            element={<Products />}
          />
          <Route
            path="/categories"
            element={<Categories />}
          />


          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />


          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/track-order"
            element={<TrackOrder />}
          />

        </Route>

        {/* =========================
            ADMIN LOGIN
        ========================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* =========================
            PROTECTED ADMIN
        ========================= */}

        <Route element={<ProtectedAdminRoute />}>
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="products"
              element={<AdminProducts />}
            />

            <Route
              path="categories"
              element={<AdminCategories />}
            />

            <Route
              path="orders"
              element={<AdminOrders />}
            />

            <Route
              path="customers"
              element={<AdminCustomers />}
            />
          </Route>
        </Route>

        {/* =========================
            404
        ========================= */}

        <Route
          path="*"
          element={<TemporaryPage title="Page Not Found" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;