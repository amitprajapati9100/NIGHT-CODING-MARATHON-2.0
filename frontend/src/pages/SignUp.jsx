import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/useAuth";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { getErrorMessage } from "../utils/helpers";

const AUTH_REQUEST_CONFIG = {
  timeout: 20000,
};

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSignup = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    if (form.password.trim().length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.SIGNUP,
        form,
        AUTH_REQUEST_CONFIG,
      );
      setAuth(response.data);
      toast.success("Your account is ready.");
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Signup failed."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ec] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 shadow-2xl shadow-slate-900/10 backdrop-blur lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)]">
        <section className="relative overflow-hidden bg-slate-900 p-8 text-white sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.35),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.18),transparent_30%)]" />
          <div className="relative">
            <Link
              to="/"
              className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-white/30 hover:text-white"
            >
              Back to Home
            </Link>

            <p className="mt-10 text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">
              Create your workspace
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Turn interview prep into a repeatable system.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              Start with your target role, generate focused questions, and save the stories and examples you want to deliver confidently.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Responsive dashboard for desktop and mobile",
                "Tailored questions based on role and experience",
                "Saved notes and AI explanations inside each session",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-10">
          <form onSubmit={handleSignup} className="mx-auto w-full max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              New account
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Create your AI interview prep profile
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              We’ll use this space to help you organize sessions, review answers, and save your best speaking points.
            </p>

            <div className="mt-8 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Full name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Amit Kumar"
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Email address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
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
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Minimum 6 characters"
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
              {submitting ? "Creating account..." : "Create Account"}
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-slate-900 hover:text-orange-500">
                Login here
              </Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};

export default SignUp;
