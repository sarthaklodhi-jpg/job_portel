import React, { useState } from "react";
import Navbar from "../shared/navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setLoading, setUser } from "@/redux/authslice";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const showGoogleLogin =
    googleClientId && !["localhost", "127.0.0.1"].includes(window.location.hostname);

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const getLandingPath = (loggedInUser) =>
    loggedInUser?.role === "recruiter" ? "/admin/companies" : "/jobs";

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.email || !input.password || !input.role) {
      toast.error("All fields are required");
      return;
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate(getLandingPath(res.data.user));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="app-bg">
      <Navbar />

      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <motion.form
          onSubmit={submitHandler}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="premium-card w-full max-w-[440px] p-8"
        >
          <div className="mb-8 text-center">
            <span className="eyebrow mx-auto">Welcome back</span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">
              Log in to JobPortal
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Continue your job search or manage your hiring workspace.
            </p>
          </div>

          <div className="mb-5">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-5">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-7">
            <Label className="mb-2 block">Continue as</Label>
            <div className="grid grid-cols-2 gap-4">
              {["student", "recruiter"].map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setInput((prev) => ({ ...prev, role }))}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border p-3 transition ${
                    input.role === role
                      ? "border-sky-300 bg-sky-50 text-sky-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-semibold capitalize">{role}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <Button className="w-full" disabled>
              <Loader2 className="animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Log In
            </Button>
          )}

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <a href="/signup" className="font-semibold text-sky-700 hover:underline">
              Sign Up
            </a>
          </p>

          {showGoogleLogin && (
            <>
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm text-slate-400">OR</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="flex justify-center">
                <GoogleLoginBlock getLandingPath={getLandingPath} />
              </div>
            </>
          )}
        </motion.form>
      </div>
    </div>
  );
};

const GoogleLoginBlock = ({ getLandingPath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          dispatch(setLoading(true));

          const res = await axios.post(
            `${USER_API_END_POINT}/google`,
            { token: credentialResponse.credential },
            { withCredentials: true }
          );

          if (res.data.success) {
            dispatch(setUser(res.data.user));

            if (!res.data.isProfileComplete) {
              navigate("/complete-profile");
            } else {
              navigate(getLandingPath(res.data.user));
            }
          }
        } catch {
          toast.error("Google login failed");
        } finally {
          dispatch(setLoading(false));
        }
      }}
      onError={() => toast.error("Google Login Failed")}
    />
  );
};

export default Login;
