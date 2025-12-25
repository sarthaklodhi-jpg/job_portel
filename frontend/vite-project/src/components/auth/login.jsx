import React, { useEffect, useState } from "react";
import Navbar from "../shared/navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setLoading, setUser } from "@/redux/authslice";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.email || !input.password || !input.role) {
      toast.error("All fields are required");
      return;
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // 🔴 REQUIRED for cookies
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  /* =========================
     SAFETY EFFECT
  ========================= */
  useEffect(() => {
    dispatch(setLoading(false));
    if (user) navigate("/");
  }, [user, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f9f6ff] to-white">
      <Navbar />

      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F83802]/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl" />

      <div className="relative flex items-center justify-center max-w-7xl mx-auto py-20 px-4">
        <motion.form
          onSubmit={submitHandler}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full sm:w-2/3 md:w-1/2 lg:w-[420px]
                     bg-white border border-gray-200 rounded-2xl
                     shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-extrabold text-3xl text-[#F83802]">
              Welcome Back 👋
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Log in to continue your job search
            </p>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="mb-5">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="••••••••"
            />
          </div>

          {/* Role */}
          <div className="mb-7">
            <Label className="block mb-2">Continue as</Label>

            <RadioGroup className="grid grid-cols-2 gap-4">
              {["student", "recruiter"].map((role) => (
                <label
                  key={role}
                  className={`flex items-center justify-center p-3 rounded-xl cursor-pointer border
                    ${
                      input.role === role
                        ? "border-[#F83802] bg-[#F83802]/5 text-[#F83802]"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  <Input
                    type="radio"
                    name="role"
                    value={role}
                    checked={input.role === role}
                    onChange={changeEventHandler}
                    className="hidden"
                  />
                  <span className="capitalize font-medium">
                    {role}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Submit */}
          {loading ? (
            <Button className="w-full flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              Please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-[#F83802] hover:bg-[#d52e00]
                         text-white font-semibold py-3 rounded-xl"
            >
              Log In
            </Button>
          )}

          <p className="text-center text-sm mt-6 text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-[#F83802] font-medium hover:underline"
            >
              Sign Up
            </a>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;
