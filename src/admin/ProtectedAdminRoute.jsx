import {
  Navigate,
  Outlet,
} from "react-router-dom";

function ProtectedAdminRoute() {
  const token =
    localStorage.getItem(
      "honeyglow_admin_token"
    );

  const adminData =
    localStorage.getItem(
      "honeyglow_admin"
    );

  if (
    !token ||
    !adminData
  ) {
    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }

  try {
    const admin =
      JSON.parse(adminData);

    if (
      !admin?.id ||
      !admin?.email
    ) {
      throw new Error(
        "Invalid admin data"
      );
    }
  } catch {
    localStorage.removeItem(
      "honeyglow_admin_token"
    );

    localStorage.removeItem(
      "honeyglow_admin"
    );

    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;