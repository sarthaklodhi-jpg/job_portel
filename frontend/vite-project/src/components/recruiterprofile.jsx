import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Navbar from "./shared/navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Building2, Contact, Globe, Mail, Pen } from "lucide-react";
import { COMPANY_API_END_POINT, JOB_API_END_POINT, USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authslice";
import { toast } from "sonner";
import { GradientHero, SectionCard, StatCard } from "./shared/dashboard-primitives";

const RecruiterProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ companies: 0, jobs: 0, applicants: 0 });

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    designation: user?.profile?.designation || "",
    location: user?.profile?.location || "",
    experience: user?.profile?.experience || "",
    companyName: user?.profile?.companyName || "",
    companyWebsite: user?.profile?.companyWebsite || "",
    companyDescription: user?.profile?.companyDescription || "",
    linkedin: user?.profile?.socialLinks?.linkedin || "",
    twitter: user?.profile?.socialLinks?.twitter || "",
    profilePhoto: null,
    companyLogo: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [companyRes, jobRes] = await Promise.all([
          axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true }),
          axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true }),
        ]);
        const jobs = jobRes.data.jobs || [];
        setStats({
          companies: (companyRes.data.companies || []).length,
          jobs: jobs.length,
          applicants: jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0),
        });
      } catch {
        setStats({ companies: 0, jobs: 0, applicants: 0 });
      }
    };

    if (user?.role === "recruiter") fetchStats();
  }, [user]);

  const completion = useMemo(() => {
    const fields = [
      user?.fullname,
      user?.email,
      user?.phoneNumber,
      user?.profile?.bio,
      user?.profile?.skills?.length,
      user?.profile?.designation,
      user?.profile?.location,
      user?.profile?.companyName,
      user?.profile?.companyWebsite,
      user?.profile?.companyDescription,
      user?.profile?.profilePhoto,
      user?.profile?.companyLogo,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("bio", input.bio);
      formData.append("skills", JSON.stringify(input.skills.split(",").map((s) => s.trim()).filter(Boolean)));
      formData.append("designation", input.designation);
      formData.append("location", input.location);
      formData.append("experience", input.experience);
      formData.append("companyName", input.companyName);
      formData.append("companyWebsite", input.companyWebsite);
      formData.append("companyDescription", input.companyDescription);
      formData.append("linkedin", input.linkedin);
      formData.append("twitter", input.twitter);

      if (input.profilePhoto) formData.append("profilePhoto", input.profilePhoto);
      if (input.companyLogo) formData.append("companyLogo", input.companyLogo);

      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Recruiter profile updated successfully");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update recruiter profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 px-4 space-y-6">
        <GradientHero
          title={user?.fullname || "Recruiter"}
          subtitle={user?.profile?.designation || "Recruiter Profile"}
          right={
            <Button onClick={() => setOpen(true)} variant="secondary">
              <Pen className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          }
        >
          <div className="mt-4 flex items-center gap-4">
            <Avatar className="h-20 w-20 ring-4 ring-white/20">
              <AvatarImage src={user?.profile?.profilePhoto || "/avatar.png"} />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-slate-200 mb-1">
                <span>Profile completeness</span>
                <span>{completion}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>
        </GradientHero>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Companies" value={stats.companies} />
          <StatCard label="Active Jobs" value={stats.jobs} />
          <StatCard label="Applicants" value={stats.applicants} />
        </div>

        <SectionCard title="Recruiter Details">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <p className="flex items-center gap-2 text-slate-700"><Mail className="h-4 w-4" />{user?.email || "NA"}</p>
            <p className="flex items-center gap-2 text-slate-700"><Contact className="h-4 w-4" />{user?.phoneNumber || "NA"}</p>
            <p className="text-slate-700"><span className="font-semibold">Location:</span> {user?.profile?.location || "Not added"}</p>
            <p className="text-slate-700"><span className="font-semibold">Experience:</span> {user?.profile?.experience || "Not added"}</p>
          </div>
          <p className="mt-4 text-slate-600">{user?.profile?.bio || "No bio available."}</p>
        </SectionCard>

        <SectionCard title="Skills">
          <div className="flex flex-wrap gap-2">
            {(user?.profile?.skills || []).length ? (
              user.profile.skills.map((skill, index) => <Badge key={index}>{skill}</Badge>)
            ) : (
              <span className="text-slate-500">No skills added yet</span>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Company Information">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <p className="text-slate-700"><span className="font-semibold">Company Name:</span> {user?.profile?.companyName || "Not added"}</p>
            <p className="text-slate-700 flex items-center gap-2"><Globe className="h-4 w-4" />{user?.profile?.companyWebsite || "Not added"}</p>
            <p className="text-slate-700"><span className="font-semibold">LinkedIn:</span> {user?.profile?.socialLinks?.linkedin || "Not added"}</p>
            <p className="text-slate-700"><span className="font-semibold">Twitter:</span> {user?.profile?.socialLinks?.twitter || "Not added"}</p>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-14 w-14 border">
              <AvatarImage src={user?.profile?.companyLogo || "/avatar.png"} />
            </Avatar>
            <p className="text-sm text-slate-500 flex items-center gap-2"><Building2 className="h-4 w-4" />Company Logo</p>
          </div>
          <p className="text-slate-600">{user?.profile?.companyDescription || "No company description added."}</p>
        </SectionCard>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Recruiter Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitHandler} className="space-y-3">
            <Input name="fullname" value={input.fullname} onChange={(e) => setInput({ ...input, fullname: e.target.value })} placeholder="Full name" />
            <Input name="email" value={input.email} onChange={(e) => setInput({ ...input, email: e.target.value })} placeholder="Email" />
            <Input name="phoneNumber" value={input.phoneNumber} onChange={(e) => setInput({ ...input, phoneNumber: e.target.value })} placeholder="Phone number" />
            <Textarea name="bio" value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} placeholder="Bio" />
            <Input name="skills" value={input.skills} onChange={(e) => setInput({ ...input, skills: e.target.value })} placeholder="Hiring, ATS, Employer Branding" />
            <div className="grid grid-cols-2 gap-3">
              <Input name="designation" value={input.designation} onChange={(e) => setInput({ ...input, designation: e.target.value })} placeholder="Designation" />
              <Input name="experience" value={input.experience} onChange={(e) => setInput({ ...input, experience: e.target.value })} placeholder="Experience" />
            </div>
            <Input name="location" value={input.location} onChange={(e) => setInput({ ...input, location: e.target.value })} placeholder="Location" />
            <Input name="companyName" value={input.companyName} onChange={(e) => setInput({ ...input, companyName: e.target.value })} placeholder="Company name" />
            <Input name="companyWebsite" value={input.companyWebsite} onChange={(e) => setInput({ ...input, companyWebsite: e.target.value })} placeholder="Company website" />
            <Textarea name="companyDescription" value={input.companyDescription} onChange={(e) => setInput({ ...input, companyDescription: e.target.value })} placeholder="Company description" />
            <div className="grid grid-cols-2 gap-3">
              <Input name="linkedin" value={input.linkedin} onChange={(e) => setInput({ ...input, linkedin: e.target.value })} placeholder="LinkedIn URL" />
              <Input name="twitter" value={input.twitter} onChange={(e) => setInput({ ...input, twitter: e.target.value })} placeholder="Twitter URL" />
            </div>

            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <Input type="file" accept="image/*" onChange={(e) => setInput({ ...input, profilePhoto: e.target.files?.[0] || null })} />
            </div>
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <Input type="file" accept="image/*" onChange={(e) => setInput({ ...input, companyLogo: e.target.files?.[0] || null })} />
            </div>

            <DialogFooter>
              <Button disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecruiterProfile;
