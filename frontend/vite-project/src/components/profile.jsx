import React, { useState } from "react";
import Navbar from "./shared/navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, FileText, Mail, Pen, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./appliedjobtable";
import UpdateProfileDialog from "./updateprofiledialog.jsx";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "../hook/usegetappliedjob.jsx";
import { motion } from "framer-motion";
import { downloadResume, getResumeName, getResumeUrl, getResumeDownloadUrl } from "../utils/resume.js";
import ResumeScreening from "./ResumeScreening.jsx";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const fullName = user?.fullname || "User";
  const email = user?.email || "NA";
  const phone = user?.phoneNumber || "NA";
  const bio = user?.profile?.bio || "No bio available.";
  const skills = user?.profile?.skills || [];
  const resumeDownloadUrl = getResumeDownloadUrl(user?.profile) || getResumeUrl(user?.profile);
  const resumeName = getResumeName(user?.profile);

  return (
    <div className="app-bg">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="premium-card mx-auto mt-10 max-w-5xl p-6 sm:p-8"
      >
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-5">
            <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
              <AvatarImage
                src={user?.profile?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"}
                alt={fullName}
              />
            </Avatar>

            <div>
              <span className="eyebrow mb-3">Candidate profile</span>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
                {fullName}
              </h1>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{bio}</p>
            </div>
          </div>

          <Button onClick={() => setOpen(true)} variant="outline">
            <Pen className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-slate-700">
            <Mail className="h-5 w-5 text-sky-600" />
            <span className="truncate">{email}</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-slate-700">
            <Contact className="h-5 w-5 text-teal-600" />
            <span>{phone}</span>
          </div>
        </div>

        <div className="my-8 border-t border-slate-200" />

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-950">
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-sm italic text-slate-400">No skills added yet</span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-md font-semibold text-slate-950">
            <FileText className="h-4 w-4 text-sky-600" />
            Resume
          </Label>
          {resumeDownloadUrl ? (
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={resumeDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sky-700 underline underline-offset-4"
              >
                {resumeName}
              </a>
              <Button size="sm" onClick={() => downloadResume(user?.profile)}>
                Download
              </Button>
            </div>
          ) : (
            <span className="text-sm text-slate-400">No resume uploaded</span>
          )}
        </div>
      </motion.div>

      <ResumeScreening />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="premium-card mx-auto mt-10 max-w-5xl p-6 sm:p-8"
      >
        <h1 className="mb-4 flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-950">
          <Sparkles className="h-5 w-5 text-sky-600" />
          Applied Jobs
        </h1>
        <AppliedJobTable />
      </motion.div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
