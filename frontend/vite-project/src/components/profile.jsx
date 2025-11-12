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

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  // Handle dialog open/close state
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
  };

  // Fallbacks in case of missing data
  const fullName = user?.fullname || "User";
  const email = user?.email || "NA";
  const phone = user?.phoneNumber || "NA";
  const bio = user?.profile?.bio || "No bio available.";
  const skills = user?.profile?.skills || [];
  const resumeUrl = user?.profile?.resume || "";

  // Extract file name from Cloudinary URL
  const getResumeFileName = (url) => {
    if (!url) return "";
    try {
      const parts = url.split("/");
      const lastPart = parts[parts.length - 1];
      const fileName = decodeURIComponent(lastPart.split("?")[0]);
      return fileName.length > 30 ? fileName.slice(0, 30) + "..." : fileName;
    } catch {
      return "Resume.pdf";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto mt-10 bg-white border border-gray-200 rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-24 w-24 ring-2 ring-gray-200">
              <AvatarImage
                src={
                  user?.profile?.profilePhoto ||
                  "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                }
                alt={fullName}
              />
            </Avatar>
            <div>
              <h1 className="font-semibold text-2xl text-gray-800">
                {fullName}
              </h1>
              <p className="text-gray-500 text-sm max-w-md">{bio}</p>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="rounded-full border-gray-300 hover:bg-gray-100 transition-colors"
          >
            <Pen className="w-4 h-4 mr-1" /> Edit
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="text-sm sm:text-base">{email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Contact className="w-5 h-5 text-gray-500" />
            <span className="text-sm sm:text-base">{phone}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Skills */}
      <div className="mb-8">
  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
    <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
    Skills
  </h2>

  <div className="flex flex-wrap gap-3">
    {skills && skills.length > 0 ? (
      skills.map((skill, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="px-4 py-2 rounded-xl text-sm font-semibold text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm hover:shadow-md hover:scale-105 transition-transform duration-200"
        >
          {skill}
        </Badge>
      ))
    ) : (
      <span className="text-gray-400 text-sm italic">No skills added yet</span>
    )}
  </div>
</div>

        {/* Resume */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-bold text-gray-800">Resume</Label>
          {resumeUrl ? (
           <div className="flex items-center gap-2">
  <a
    href={resumeUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:text-blue-800 underline text-sm sm:text-base"
  >
    {user?.profile?.resumeOriginalName || "View Resume"}
  </a>
  <Button
    asChild
    size="sm"
    variant="outline"
    className="text-xs px-2 py-1 border-gray-300 hover:bg-gray-100"
  >
    <a href={resumeUrl} download>
      Download
    </a>
  </Button>
</div>

          ) : (
            <span className="text-gray-400 text-sm">No resume uploaded</span>
          )}
        </div>
      </div>

      {/* Applied Jobs */}
      <div className="max-w-4xl mx-auto mt-8 bg-white border border-gray-200 rounded-2xl shadow-md p-8">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Applied Jobs
        </h1>
        <AppliedJobTable />
      </div>

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
