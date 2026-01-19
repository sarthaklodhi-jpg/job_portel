import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
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
  });

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileHandler = (e) => {
    setInput({ ...input, file: e.target.files[0] });
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
    if (input.file) formData.append("file", input.file);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/complete-profile`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile completed successfully");

        // ✅ ROLE-BASED REDIRECT
      navigate("/");

      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to complete profile"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[#f9f6ff] to-white px-4">
      <form
        onSubmit={submitHandler}
        className="bg-white w-full max-w-[440px] p-8 rounded-2xl shadow-xl border"
      >
        <h2 className="text-3xl font-extrabold text-center text-[#F83802] mb-6">
          Complete Profile ✨
        </h2>

        {/* Phone */}
        <div className="mb-4">
          <Label>Phone Number</Label>
          <Input
            name="phoneNumber"
            value={input.phoneNumber}
            onChange={changeHandler}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeHandler}
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <Label>Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={input.confirmPassword}
            onChange={changeHandler}
          />
        </div>

        {/* Role */}
        <div className="mb-6">
          <Label className="mb-2 block">Continue as</Label>
          <RadioGroup className="grid grid-cols-2 gap-4">
            {["student", "recruiter"].map((r) => (
              <label
                key={r}
                className={`border rounded-xl p-3 text-center cursor-pointer
                  ${
                    input.role === r
                      ? "border-[#F83802] bg-[#F83802]/5 text-[#F83802]"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={input.role === r}
                  onChange={(e) =>
                    setInput({ ...input, role: e.target.value })
                  }
                  className="hidden"
                />
                <span className="capitalize font-medium">{r}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Profile Photo */}
        <div className="mb-6">
          <Label>Profile Photo (optional)</Label>
          <Input type="file" accept="image/*" onChange={fileHandler} />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#F83802] hover:bg-[#d52e00] text-white font-semibold py-3 rounded-xl"
        >
          Finish Setup
        </Button>
      </form>
    </div>
  );
};

export default CompleteProfile;
