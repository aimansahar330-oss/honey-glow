import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";

import { loginAdmin } from "../services/adminApi";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginAdmin,

    onSuccess: (data) => {
      localStorage.setItem(
        "honeyglow_admin_token",
        data.token
      );

      localStorage.setItem(
        "honeyglow_admin",
        JSON.stringify(data.admin)
      );

      navigate("/admin");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8efec] px-5 py-10 dark:bg-[#120e10]">

      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#e5b7bd]/35 blur-[100px] dark:bg-[#7f3245]/15" />
      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#e8bd68]/20 blur-[100px] dark:bg-[#c49448]/10" />

      <div className="relative grid w-full max-w-[1050px] overflow-hidden rounded-[32px] border border-white/60 bg-white/75 shadow-[0_30px_90px_rgba(77,42,48,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1d171a]/90 lg:grid-cols-[0.9fr_1.1fr]">

        {/* LEFT */}
        <div className="relative hidden min-h-[620px] overflow-hidden bg-gradient-to-br from-[#763746] via-[#9d5262] to-[#c98479] p-12 text-white lg:flex lg:flex-col lg:justify-between">

          <div className="absolute -right-24 top-14 h-72 w-72 rounded-full border border-white/15" />
          <div className="absolute -right-10 top-28 h-52 w-52 rounded-full border border-white/15" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="HoneyGlow"
                className="h-16 w-16 object-contain"
              />

              <div>
                <p className="font-beauty text-3xl font-semibold">
                  HoneyGlow
                </p>

                <p className="text-[8px] uppercase tracking-[0.25em] text-white/65">
                  Admin Studio
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Sparkles
              size={28}
              className="mb-6 text-[#f5d6ad]"
            />

            <h1 className="font-beauty text-5xl font-semibold leading-[0.95]">
              Manage beauty
              <br />
              beautifully.
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
              Products, categories, orders and customers in one
              elegant HoneyGlow workspace.
            </p>
          </div>

          <p className="relative text-[9px] uppercase tracking-[0.22em] text-white/45">
            HoneyGlow Management System
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center p-6 sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-[420px]">

            <div className="mb-9 lg:hidden">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="HoneyGlow"
                  className="h-14 w-14 object-contain"
                />

                <div>
                  <p className="font-beauty text-3xl font-semibold text-[#4d2931] dark:text-[#f6e9eb]">
                    HoneyGlow
                  </p>

                  <p className="text-[7px] uppercase tracking-[0.24em] text-[#a2767e]">
                    Admin Studio
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#9f5967]">
              Secure Access
            </p>

            <h2 className="font-beauty mt-2 text-4xl font-semibold text-[#45272e] dark:text-[#f8ecee]">
              Welcome back
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#8b7176] dark:text-[#ad969b]">
              Sign in to manage your HoneyGlow store.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#70565c] dark:text-[#baa4a8]">
                  Email
                </label>

                <div className="flex items-center rounded-2xl border border-[#e5d3d1] bg-white px-4 transition focus-within:border-[#a95b6b] dark:border-white/10 dark:bg-[#171215]">
                  <Mail
                    size={17}
                    className="text-[#a36a74]"
                  />

                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    placeholder="admin@honeyglow.com"
                    className="w-full bg-transparent px-3 py-4 text-sm text-[#49353a] outline-none placeholder:text-[#b9a4a8] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#70565c] dark:text-[#baa4a8]">
                  Password
                </label>

                <div className="flex items-center rounded-2xl border border-[#e5d3d1] bg-white px-4 transition focus-within:border-[#a95b6b] dark:border-white/10 dark:bg-[#171215]">
                  <LockKeyhole
                    size={17}
                    className="text-[#a36a74]"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter password"
                    className="w-full bg-transparent px-3 py-4 text-sm text-[#49353a] outline-none placeholder:text-[#b9a4a8] dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="text-[#9c6871]"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {loginMutation.isError && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-300">
                  {loginMutation.error?.response?.data?.message ||
                    "Unable to login."}
                </div>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full rounded-2xl bg-[#783747] py-4 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(120,55,71,0.22)] transition hover:bg-[#622c39] disabled:opacity-60"
              >
                {loginMutation.isPending
                  ? "Signing in..."
                  : "Enter Admin Studio"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;