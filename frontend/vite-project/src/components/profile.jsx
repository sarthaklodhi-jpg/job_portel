import React, { useState } from "react";
import Navbar from "./shared/navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./appliedjobtable";
import UpdateProfileDialog from "./updateprofiledialog.jsx";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "../hook/usegetappliedjob.jsx";
import { motion } from "framer-motion";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const fullName = user?.fullname || "User";
  const email = user?.email || "NA";
  const phone = user?.phoneNumber || "NA";
  const bio = user?.profile?.bio || "No bio available.";
  const skills = user?.profile?.skills || [];

  // ✅ USE BACKEND-GENERATED DOWNLOAD URL
  const resumeDownloadUrl = user?.profile?.resumeDownloadUrl || "";
  const resumeName = user?.profile?.resumeOriginalName || "View Resume";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ===== Profile Card ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto mt-12 bg-white border border-gray-200 
                   rounded-2xl shadow-lg p-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-24 w-24 ring-4 ring-gray-100 shadow-sm">
              <AvatarImage
                src={
                  user?.profile?.profilePhoto ||
                  "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                }
                alt={fullName}
              />
            </Avatar>

            <div>
              <h1 className="font-bold text-2xl text-gray-900">
                {fullName}
              </h1>
              <p className="text-gray-500 text-sm max-w-md mt-1">
                {bio}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="rounded-full border-gray-300 hover:bg-gray-100"
          >
            <Pen className="w-4 h-4 mr-1" /> Edit Profile
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
            <Mail className="w-5 h-5 text-gray-500" />
            <span>{email}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
            <Contact className="w-5 h-5 text-gray-500" />
            <span>{phone}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t" />

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Skills
          </h2>

          <div className="flex flex-wrap gap-3">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-gray-400 italic">
                No skills added yet
              </span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="space-y-2">
          <Label className="text-md font-semibold text-gray-800">
            Resume
          </Label>

          {resumeDownloadUrl ? (
            <div className="flex items-center gap-3">
              <a
                href={resumeDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {resumeName}
              </a>

              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(resumeDownloadUrl, "_blank")}
              >
                Download
              </Button>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">
              No resume uploaded
            </span>
          )}
        </div>
      </motion.div>

      {/* ===== Applied Jobs ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="max-w-4xl mx-auto mt-10 bg-white border border-gray-200 
                   rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Applied Jobs
        </h1>
        <AppliedJobTable />
      </motion.div>

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
