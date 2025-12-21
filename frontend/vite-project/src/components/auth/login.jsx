import React, { useEffect, useState } from "react";
import Navbar from "../shared/navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setLoading, setUser } from "@/redux/authslice";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading, user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f9f6ff] to-white">
      <Navbar />

      {/* Decorative background */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F83802]/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl" />

      <div className="relative flex items-center justify-center max-w-7xl mx-auto py-20 px-4">
        <motion.form
          onSubmit={submitHandler}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
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
            <Label htmlFor="email" className="font-medium">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              id="email"
              placeholder="you@example.com"
              className="mt-1"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <Label htmlFor="password" className="font-medium">
              Password
            </Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              id="password"
              placeholder="••••••••"
              className="mt-1"
            />
          </div>

          {/* Role */}
          <div className="mb-7">
            <Label className="font-medium mb-2 block">
              Continue as
            </Label>

            <RadioGroup className="grid grid-cols-2 gap-4">
              {["student", "recruiter"].map((role) => (
                <label
                  key={role}
                  className={`flex items-center justify-center gap-2 
                    border rounded-xl p-3 cursor-pointer transition
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
                  <span className="font-medium capitalize">{role}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Submit */}
          {loading ? (
            <Button className="w-full flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-[#F83802] hover:bg-[#d52e00] 
                         text-white font-semibold py-3 text-lg rounded-xl"
            >
              Log In
            </Button>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
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
