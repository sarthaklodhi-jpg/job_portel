import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authslice";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
    file: null,
    resume: null,
  });

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileHandler = (e) => {
    setInput({ ...input, file: e.target.files[0] });
  };

  const resumeHandler = (e) => {
    setInput({ ...input, resume: e.target.files[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.phoneNumber || !input.password || !input.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (!input.role) {
      toast.error("Please select a role");
      return;
    }

    if (input.password !== input.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("profilePhoto", input.file);
    if (input.role === "student" && input.resume) {
      formData.append("resume", input.resume);
    }

    try {
      const res = await axios.post(`${USER_API_END_POINT}/complete-profile`, formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile completed successfully");
        navigate(res.data.user?.role === "recruiter" ? "/admin/companies" : "/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete profile");
    }
  };

  return (
    <div className="app-bg flex items-center justify-center px-4 py-16">
      <form onSubmit={submitHandler} className="premium-card w-full max-w-[460px] p-8">
        <div className="mb-8 text-center">
          <span className="eyebrow mx-auto">Final step</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">
            Complete Profile
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Add the essentials so your workspace is ready.
          </p>
        </div>

        <div className="mb-4">
          <Label>Phone Number</Label>
          <Input name="phoneNumber" value={input.phoneNumber} onChange={changeHandler} />
        </div>

        <div className="mb-4">
          <Label>Password</Label>
          <Input type="password" name="password" value={input.password} onChange={changeHandler} />
        </div>

        <div className="mb-4">
          <Label>Confirm Password</Label>
          <Input type="password" name="confirmPassword" value={input.confirmPassword} onChange={changeHandler} />
        </div>

        <div className="mb-6">
          <Label className="mb-2 block">Continue as</Label>
          <div className="grid grid-cols-2 gap-4">
            {["student", "recruiter"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setInput((prev) => ({ ...prev, role: r }))}
                className={`cursor-pointer rounded-xl border p-3 text-center transition ${
                  input.role === r
                    ? "border-sky-300 bg-sky-50 text-sky-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="font-semibold capitalize">{r}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <Label>Profile Photo (optional)</Label>
          <Input type="file" accept="image/*" onChange={fileHandler} />
        </div>

        {input.role === "student" && (
          <div className="mb-6">
            <Label>Resume (PDF recommended)</Label>
            <Input type="file" accept=".pdf,.doc,.docx" onChange={resumeHandler} />
            {input.resume && (
              <p className="mt-2 text-xs text-slate-500">Selected: {input.resume.name}</p>
            )}
          </div>
        )}

        <Button type="submit" className="w-full">
          Finish Setup
        </Button>
      </form>
    </div>
  );
};

export default CompleteProfile;
