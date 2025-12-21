import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./updateprofiledialog.jsx";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "../hook/usegetappliedjob.jsx";
import { motion } from "framer-motion";

const getDownloadUrl = (url) => {
  if (!url) return "";

  // insert fl_attachment after /upload/
  return url.replace("/upload/", "/upload/fl_attachment/");
};

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
  };

  const fullName = user?.fullname || "User";
  const email = user?.email || "NA";
  const phone = user?.phoneNumber || "NA";
  const bio = user?.profile?.bio || "No bio available.";
  const skills = user?.profile?.skills || [];
  const resumeUrl = user?.profile?.resume || "";

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
            <span className="text-sm sm:text-base">{email}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
            <Contact className="w-5 h-5 text-gray-500" />
            <span className="text-sm sm:text-base">{phone}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t" />

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Skills
          </h2>

          <div className="flex flex-wrap gap-3">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-4 py-2 rounded-xl text-sm font-semibold 
                             text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 
                             border border-blue-200 shadow-sm 
                             hover:shadow-md hover:scale-105 transition"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-gray-400 text-sm italic">
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

          {resumeUrl ? (
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm sm:text-base"
              >
                {user?.profile?.resumeOriginalName || "View Resume"}
              </a>

             <Button
  size="sm"
  variant="outline"
  onClick={() => window.open(getDownloadUrl(resumeUrl), "_blank")}
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
      <UpdateProfileDialog
        open={open}
        setOpen={setOpen}
        onOpenChange={handleOpenChange}
      />
    </div>
  );
};

export default Profile;
