import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSingleJob } from "../redux/jobslice.js";
import {
  JOB_API_END_POINT,
  APPLICATION_API_END_POINT,
} from "../utils/constant.js";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import CompanyAvatar from "./shared/CompanyAvatar";

const JobDescription = () => {
  const dispatch = useDispatch();
  const { id: jobId } = useParams();

  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application?.applicant?._id === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [loading, setLoading] = useState(false);

  // ================= APPLY JOB =================
  const applyJobHandler = async () => {
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
          applications: [
            ...(singleJob.applications || []),
            { applicant: user._id },
          ],
        };

        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to apply. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH JOB =================
  const fetchSingleJob = async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
        setIsApplied(
          res.data.job.applications?.some(
            (application) => application?.applicant === user?._id
          )
        );
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  };

  useEffect(() => {
    if (jobId) fetchSingleJob();
  }, [jobId, user?._id]);

  if (!singleJob) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-500 text-lg">
        Loading job details...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-6xl mx-auto my-12 px-4"
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        {/* ================= COMPANY HEADER ================= */}
        <div className="flex items-center gap-4 mb-6">
         <CompanyAvatar
  name={singleJob?.company?.name || "Company"}
  logo={singleJob?.company?.logo}
  size={56}
/>


          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {singleJob?.company?.name || "Company Name"}
            </h2>
            <p className="text-sm text-gray-500">
              {singleJob?.location || "Location not specified"}
            </p>
          </div>
        </div>

        {/* ================= JOB HEADER ================= */}
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {singleJob?.title}
            </h1>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="text-blue-700 font-semibold">
                Positions: {singleJob?.position || "N/A"}
              </Badge>
              <Badge
                variant="outline"
                className="text-[#F83002] font-semibold"
              >
                {singleJob?.jobType || "N/A"}
              </Badge>
              <Badge
                variant="outline"
                className="text-[#7209b7] font-semibold"
              >
                ₹{singleJob?.salary || "Not Disclosed"} LPA
              </Badge>
            </div>
          </div>

          {/* ================= APPLY BUTTON ================= */}
          <div className="flex items-start">
            <Button
              onClick={isApplied || loading ? null : applyJobHandler}
              disabled={isApplied || loading}
              className={`px-8 py-3 rounded-xl text-sm font-semibold shadow-md ${
                isApplied || loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#7209b7] hover:bg-[#5c0991] text-white"
              }`}
            >
              {loading
                ? "Applying..."
                : isApplied
                ? "Already Applied"
                : "Apply Now"}
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-8" />

        {/* ================= JOB DETAILS ================= */}
        <div className="grid md:grid-cols-2 gap-6 text-gray-700">
          <Detail label="Company" value={singleJob?.company?.name} />
          <Detail label="Location" value={singleJob?.location} />
          <Detail label="Job Type" value={singleJob?.jobType} />
          <Detail
            label="Salary"
            value={`₹${singleJob?.salary || "Not Disclosed"} LPA`}
          />
          <Detail
            label="Total Applications"
            value={singleJob?.applications?.length || 0}
          />
          <Detail
            label="Posted On"
            value={
              singleJob?.createdAt
                ? new Date(singleJob.createdAt).toLocaleDateString()
                : "N/A"
            }
          />
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div className="mt-8 space-y-4">
          <Section title="Job Description">
            {singleJob?.description || "No description available."}
          </Section>

          <Section title="Requirements">
            {singleJob?.requirements?.length > 0
              ? singleJob.requirements.join(", ")
              : "Not specified"}
          </Section>
        </div>
      </div>
    </motion.div>
  );
};

const Detail = ({ label, value }) => (
  <div className="bg-gray-50 border rounded-lg p-4">
    <p className="text-sm font-semibold text-gray-600">{label}</p>
    <p className="text-gray-900 mt-1">{value || "N/A"}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-700 leading-relaxed">{children}</p>
  </div>
);

export default JobDescription;
