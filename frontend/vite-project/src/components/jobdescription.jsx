import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSingleJob } from "../redux/jobslice.js";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from "../utils/constant.js";
import { toast } from "react-hot-toast";

const JobDescription = () => {
  const dispatch = useDispatch();
  const { id: jobId } = useParams();
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  // ✅ Initial apply check (only once)
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) =>
        application?.applicant?._id === user?._id 
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [loading, setLoading] = useState(false);

  console.log("🧩 Initial Apply State:", isApplied);

  // ✅ Apply Job Handler
  const applyJobHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true }
      );

      console.log("Apply API Response:", res.data);

      if (res.data.success) {
        // Update local and Redux state instantly
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
      console.error("Error applying to job:", error);
      toast.error(
        error.response?.data?.message || "Failed to apply. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch single job (for details)
  const fetchSingleJob = async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
        setIsApplied(
          res.data.job.applications?.some(
            (application) =>
              application?.applicant?._id === user?._id 
          ) || false
           
        );
        }
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  };

  useEffect(() => {
    if (jobId) fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  if (!singleJob) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-500 text-lg">
        Loading job details...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10 p-8 bg-white border border-gray-200 rounded-xl shadow-md">
      {/* ====== Header ====== */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-bold text-3xl mb-2 text-gray-900">
            {singleJob?.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge className="text-blue-700 font-bold" variant="ghost">
              Positions: {singleJob?.position || "N/A"}
            </Badge>
            <Badge className="text-[#F83002] font-bold" variant="ghost">
              {singleJob?.jobType || "N/A"}
            </Badge>
            <Badge className="text-[#7209b7] font-bold" variant="ghost">
              Salary: ₹{singleJob?.salary || "Not Disclosed"} LPA
            </Badge>
          </div>
        </div>

        {/* ====== Apply Button ====== */}
        <Button
          onClick={isApplied || loading ? null : applyJobHandler}
          disabled={isApplied || loading}
          className={`rounded-lg px-6 ${
            isApplied || loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-[#7209b7] hover:bg-[#5c0991] text-white"
          }`}
        >
          {loading ? "Applying..." : isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      {/* ====== Divider ====== */}
      <h1 className="border-b-2 border-gray-300 font-semibold text-lg py-4 mt-6">
        Job Description
      </h1>

      {/* ====== Job Details ====== */}
      <div className="my-4 space-y-4 text-gray-700">
        <p>
          <span className="font-bold">Company ID:</span>
          <span className="pl-3 text-gray-800">{singleJob?.company || "N/A"}</span>
        </p>

        <p>
          <span className="font-bold">Location:</span>
          <span className="pl-3 text-gray-800">{singleJob?.location || "N/A"}</span>
        </p>

        <p>
          <span className="font-bold">Description:</span>
          <span className="pl-3 text-gray-800">
            {singleJob?.description || "No description available."}
          </span>
        </p>

        <p>
          <span className="font-bold">Requirements:</span>
          <span className="pl-3 text-gray-800">
            {singleJob?.requirements?.length > 0
              ? singleJob.requirements.join(", ")
              : "Not specified"}
          </span>
        </p>

        <p>
          <span className="font-bold">Job Type:</span>
          <span className="pl-3 text-gray-800">{singleJob?.jobType || "N/A"}</span>
        </p>

        <p>
          <span className="font-bold">Salary:</span>
          <span className="pl-3 text-gray-800">
            ₹{singleJob?.salary || "Not Disclosed"} LPA
          </span>
        </p>

        <p>
          <span className="font-bold">Total Applications:</span>
          <span className="pl-3 text-gray-800">
            {singleJob?.applications?.length || 0}
          </span>
        </p>

        <p>
          <span className="font-bold">Posted On:</span>
          <span className="pl-3 text-gray-800">
            {singleJob?.createdAt
              ? new Date(singleJob.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default JobDescription;
