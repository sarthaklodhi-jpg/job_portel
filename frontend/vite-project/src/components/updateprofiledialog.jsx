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
import { USER_API_END_POINT } from "../utils/constant";
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
    profilePhoto: null,
    resume: null,
  });

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const profilePhotoHandler = (e) => {
    setInput({ ...input, profilePhoto: e.target.files[0] });
  };

  const resumeHandler = (e) => {
    setInput({ ...input, resume: e.target.files[0] });
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

      if (input.profilePhoto)
        formData.append("profilePhoto", input.profilePhoto);

      if (input.resume)
        formData.append("resume", input.resume);

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated successfully");
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitHandler} className="px-6 py-5 space-y-4">
            {/* Profile Photo */}
            <div className="flex items-center gap-4">
              <img
                src={user?.profile?.profilePhoto || "/avatar.png"}
                className="w-20 h-20 rounded-full object-cover border"
              />
              <Input type="file" accept="image/*" onChange={profilePhotoHandler} />
            </div>

            <Input name="fullname" value={input.fullname} onChange={changeHandler} placeholder="Full name" />
            <Input name="email" value={input.email} onChange={changeHandler} />
            <Input name="phoneNumber" value={input.phoneNumber} onChange={changeHandler} />
            <Input name="bio" value={input.bio} onChange={changeHandler} />
            <Input name="skills" value={input.skills} onChange={changeHandler} placeholder="HTML, CSS, React" />

            {/* Resume */}
            <Input type="file" accept="application/pdf" onChange={resumeHandler} />

            <DialogFooter>
              <Button disabled={localLoading} className="w-full">
                {localLoading ? <Loader2 className="animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
