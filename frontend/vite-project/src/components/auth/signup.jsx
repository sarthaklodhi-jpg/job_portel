import React, { useState } from "react";
import Navbar from "../shared/navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setLoading } from "@/redux/authslice";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

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
          className="w-full sm:w-2/3 md:w-1/2 lg:w-[480px] 
                     bg-white border border-gray-200 
                     rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-extrabold text-3xl text-[#F83802]">
              Create Account ✨
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Join us and start your job journey today
            </p>
          </div>

          {/* Full Name */}
          <FormField
            label="Full Name"
            name="fullname"
            value={input.fullname}
            onChange={changeEventHandler}
            placeholder="John Doe"
          />

          {/* Email */}
          <FormField
            label="Email"
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="you@example.com"
          />

          {/* Phone */}
          <FormField
            label="Phone Number"
            name="phoneNumber"
            value={input.phoneNumber}
            onChange={changeEventHandler}
            placeholder="+1234567890"
          />

          {/* Password */}
          <FormField
            label="Password"
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="Create a strong password"
          />

          {/* Role */}
          <div className="mb-6">
            <Label className="font-medium mb-2 block">
              Register as
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

          {/* Profile Upload */}
          <div className="mb-7">
            <Label className="font-medium mb-2 block">
              Profile Photo (optional)
            </Label>
            <Input
              accept="image/*"
              type="file"
              onChange={changeFileHandler}
            />
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
              Sign Up
            </Button>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#F83802] font-medium hover:underline"
            >
              Log In
            </a>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

const FormField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="mb-5">
    <Label className="font-medium">{label}</Label>
    <Input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1"
    />
  </div>
);

export default Signup;
