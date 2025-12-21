import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { USER_API_END_POINT } from "../utils/constant.js";
import { toast } from "sonner";
import { setUser } from "../redux/authslice";
import { motion } from "framer-motion";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [localLoading, setLocalLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: null,
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLocalLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("bio", input.bio);
      formData.append(
        "skills",
        JSON.stringify(input.skills.split(",").map((s) => s.trim()))
      );
      if (input.file) formData.append("file", input.file);

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Profile updated successfully!");
        setOpen(false);
      } else {
        toast.error(res.data.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("Something went wrong while updating profile.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[480px] rounded-2xl p-0 overflow-hidden"
        onInteractOutside={() => setOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl font-bold">
              Update Profile
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Keep your information up to date for better opportunities.
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <form onSubmit={submitHandler} className="px-6 py-5 space-y-4">
            {/* Name */}
            <FormRow
              label="Name"
              id="fullname"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="Enter your full name"
            />

            {/* Email */}
            <FormRow
              label="Email"
              id="email"
              name="email"
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Enter your email"
            />

            {/* Phone */}
            <FormRow
              label="Phone"
              id="phoneNumber"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="Enter your number"
            />

            {/* Bio */}
            <FormRow
              label="Bio"
              id="bio"
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              placeholder="Short bio about you"
            />

            {/* Skills */}
            <FormRow
              label="Skills"
              id="skills"
              name="skills"
              value={input.skills}
              onChange={changeEventHandler}
              placeholder="HTML, CSS, React"
            />

            {/* Resume */}
            <div className="space-y-1">
              <Label htmlFor="file" className="font-medium">
                Resume (PDF)
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="application/pdf"
                onChange={fileChangeHandler}
              />
            </div>

            {/* Footer */}
            <DialogFooter className="pt-4">
              {localLoading ? (
                <Button
                  disabled
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-[#F83802] hover:bg-[#d52e00] 
                             text-white font-semibold py-2.5 rounded-xl"
                >
                  Save Changes
                </Button>
              )}
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

const FormRow = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="space-y-1">
    <Label htmlFor={id} className="font-medium">
      {label}
    </Label>
    <Input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

export default UpdateProfileDialog;
