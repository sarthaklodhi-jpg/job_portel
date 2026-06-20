import React, { useEffect, useState } from "react";
import Navbar from "../shared/navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setLoading, setUser } from "@/redux/authslice";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
    resume: "",
  });

  const { loading } = useSelector((store) => store.auth);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const showGoogleLogin =
    googleClientId && !["localhost", "127.0.0.1"].includes(window.location.hostname);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const changeResumeHandler = (e) => {
    setInput({ ...input, resume: e.target.files?.[0] });
  };

  const getLandingPath = (loggedInUser) =>
    loggedInUser?.role === "recruiter" ? "/admin/companies" : "/jobs";

  useEffect(() => {
    if (input.role !== "student" && input.resume) {
      setInput((prev) => ({ ...prev, resume: "" }));
    }
  }, [input.role, input.resume]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.fullname || !input.email || !input.phoneNumber || !input.password || !input.role) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("profilePhoto", input.file);
    if (input.role === "student" && input.resume) {
      formData.append("resume", input.resume);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

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
    <div className="app-bg">
      <Navbar />

      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <motion.form
          onSubmit={submitHandler}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="premium-card w-full max-w-[520px] p-8"
        >
          <div className="mb-8 text-center">
            <span className="eyebrow mx-auto">Create account</span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">
              Join JobPortal
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Build your profile and start moving toward the right opportunity.
            </p>
          </div>

          <FormField label="Full Name" name="fullname" value={input.fullname} onChange={changeEventHandler} placeholder="John Doe" />
          <FormField label="Email" type="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="you@example.com" />
          <FormField label="Phone Number" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} placeholder="+1234567890" />
          <FormField label="Password" type="password" name="password" value={input.password} onChange={changeEventHandler} placeholder="Create a strong password" />

          <div className="mb-6">
            <Label className="mb-2 block font-medium">Register as</Label>
            <div className="grid grid-cols-2 gap-4">
              {["student", "recruiter"].map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setInput((prev) => ({ ...prev, role }))}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 transition ${
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

          <div className="mb-7">
            <Label className="mb-2 block font-medium">Profile Photo (optional)</Label>
            <Input accept="image/*" type="file" name="file" onChange={changeFileHandler} />
          </div>

          {input.role === "student" && (
            <div className="mb-7">
              <Label className="mb-2 block font-medium">Resume (PDF recommended)</Label>
              <Input accept=".pdf,.doc,.docx" type="file" name="resume" onChange={changeResumeHandler} />
              {input.resume && (
                <p className="mt-2 text-xs text-slate-500">Selected: {input.resume.name}</p>
              )}
            </div>
          )}

          {loading ? (
            <Button className="w-full" disabled>
              <Loader2 className="animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          )}

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-sky-700 hover:underline">
              Log In
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
                <GoogleSignupBlock getLandingPath={getLandingPath} />
              </div>
            </>
          )}
        </motion.form>
      </div>
    </div>
  );
};

const FormField = ({ label, name, value, onChange, placeholder, type = "text" }) => (
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

const GoogleSignupBlock = ({ getLandingPath }) => {
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
          toast.error("Google signup failed");
        } finally {
          dispatch(setLoading(false));
        }
      }}
      onError={() => toast.error("Google Signup Failed")}
    />
  );
};

export default Signup;
