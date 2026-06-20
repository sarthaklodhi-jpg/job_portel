import React, { useCallback, useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSingleJob } from "../redux/jobslice.js";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from "../utils/constant.js";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import CompanyAvatar from "./shared/companyavatar";
import Navbar from "./shared/navbar";
import { Briefcase, CalendarDays, IndianRupee, MapPin, Users } from "lucide-react";

const JobDescription = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: jobId } = useParams();

  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isInitiallyApplied =
    singleJob?.applications?.some((application) => {
      const applicantId =
        typeof application?.applicant === "object"
          ? application?.applicant?._id
          : application?.applicant;
      return applicantId === user?._id;
    }) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [loading, setLoading] = useState(false);

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login as a student to apply");
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      toast.error("Recruiters cannot apply to jobs");
      return;
    }

    if (
      !user.profile?.resume &&
      !user.profile?.resumeUrl &&
      !user.profile?.resumeViewUrl &&
      !user.profile?.resumeDownloadUrl
    ) {
      toast.error("Please upload your resume before applying");
      navigate("/profile");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...(singleJob.applications || []), { applicant: user._id }],
        };

        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleJob = useCallback(async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
        setIsApplied(
          res.data.job.applications?.some((application) => {
            const applicantId =
              typeof application?.applicant === "object"
                ? application?.applicant?._id
                : application?.applicant;
            return applicantId === user?._id;
          })
        );
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  }, [dispatch, jobId, user?._id]);

  useEffect(() => {
    if (jobId) fetchSingleJob();
  }, [fetchSingleJob, jobId]);

  if (!singleJob) {
    return (
      <div className="app-bg">
        <Navbar />
        <div className="flex h-[70vh] items-center justify-center text-lg text-slate-500">
          Loading job details...
        </div>
      </div>
    );
  }

  return (
    <div className="app-bg">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1fr_320px]"
      >
        <div className="premium-card p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <CompanyAvatar name={singleJob?.company?.name || "Company"} logo={singleJob?.company?.logo} size={56} />
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                {singleJob?.company?.name || "Company Name"}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {singleJob?.location || "Location not specified"}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <span className="eyebrow">Job details</span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {singleJob?.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-sky-50 px-3 py-1 text-sky-700">
                <Users className="h-3 w-3" />
                Positions: {singleJob?.position || "N/A"}
              </Badge>
              <Badge variant="secondary" className="bg-teal-50 px-3 py-1 text-teal-700">
                <Briefcase className="h-3 w-3" />
                {singleJob?.jobType || "N/A"}
              </Badge>
              <Badge variant="secondary" className="bg-slate-100 px-3 py-1 text-slate-700">
                <IndianRupee className="h-3 w-3" />
                {singleJob?.salary || "Not Disclosed"} LPA
              </Badge>
            </div>
          </div>

          <div className="my-8 border-t border-slate-200" />

          <div className="grid gap-4 md:grid-cols-2">
            <Detail label="Company" value={singleJob?.company?.name} />
            <Detail label="Location" value={singleJob?.location} />
            <Detail label="Job Type" value={singleJob?.jobType} />
            <Detail label="Salary" value={`₹${singleJob?.salary || "Not Disclosed"} LPA`} />
            <Detail label="Total Applications" value={singleJob?.applications?.length || 0} />
            <Detail
              label="Posted On"
              value={singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : "N/A"}
            />
          </div>

          <div className="mt-8 space-y-6">
            <Section title="Job Description">
              {singleJob?.description || "No description available."}
            </Section>
            <Section title="Requirements">
              {singleJob?.requirements?.length > 0 ? singleJob.requirements.join(", ") : "Not specified"}
            </Section>
          </div>
        </div>

        <aside className="premium-card h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold tracking-tight text-slate-950">
            Ready to apply?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Submit your profile and resume for this role. You can track updates from your dashboard.
          </p>
          <Button
            onClick={isApplied || loading ? null : applyJobHandler}
            disabled={isApplied || loading}
            className={`mt-6 w-full ${isApplied || loading ? "bg-slate-400 text-white hover:bg-slate-400" : ""}`}
          >
            {loading ? "Applying..." : isApplied ? "Already Applied" : "Apply Now"}
          </Button>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <CalendarDays className="mb-2 h-4 w-4 text-sky-600" />
            Posted {singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : "recently"}
          </div>
        </aside>
      </motion.div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
    <p className="text-sm font-semibold text-slate-500">{label}</p>
    <p className="mt-1 font-semibold text-slate-950">{value || "N/A"}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h2 className="mb-2 text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
    <p className="leading-7 text-slate-700">{children}</p>
  </div>
);

export default JobDescription;
