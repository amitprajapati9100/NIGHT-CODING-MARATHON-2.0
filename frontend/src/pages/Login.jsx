import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/useAuth";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { getErrorMessage } from "../utils/helpers";

const AUTH_REQUEST_CONFIG = {
  timeout: 20000,
};

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const handleForm = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!form.email.trim() || !form.password.trim()) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN,
        form,
        AUTH_REQUEST_CONFIG,
      );
      setAuth(response.data);
      toast.success("Welcome back.");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Invalid email or password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ec] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 shadow-2xl shadow-slate-900/10 backdrop-blur lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
        <section className="flex items-center p-6 sm:p-10">
          <form onSubmit={handleLogin} className="mx-auto w-full max-w-lg">
            <Link
              to="/"
              className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            >
              Back to Home
            </Link>

            <p className="mt-10 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Welcome back
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Resume your interview prep session
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Pick up where you left off, generate fresh questions, and review the notes you saved for your upcoming interviews.
            </p>

            <div className="mt-8 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Email address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleForm}
                  placeholder="you@example.com"
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleForm}
                  placeholder="Your password"
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
                />
              </label>
            </div>

            {errorMessage ? (
              <p className="mt-4 rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full border border-slate-300 bg-transparent px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Login"}
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-semibold text-slate-900 hover:text-orange-500">
                Create one
              </Link>
            </p>
          </form>
        </section>

        <section className="relative overflow-hidden bg-slate-900 p-8 text-white sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.18),transparent_26%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">
              Your advantage
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              Go into the next round with sharper stories and stronger answers.
            </h2>
            <div className="mt-10 grid gap-4">
              {[
                "Review tailored questions for your target role",
                "Pin the concepts you keep getting stuck on",
                "Use saved notes as your final revision sheet",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
