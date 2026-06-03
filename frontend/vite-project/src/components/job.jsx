import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CompanyAvatar from "./shared/companyavatar";
const Job = ({ job }) => {
  const navigate = useNavigate();

  // Calculate days ago
  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysAgo;
  };

  // Format salary nicely
  const formatSalary = (salary) => {
    if (!salary) return "Salary not disclosed";
    if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)} LPA`;
    }
    return `₹${salary}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative p-6 rounded-xl bg-white border border-gray-200 
                 shadow-sm hover:shadow-xl transition-all"
    >
      {/* Top Row */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="font-medium">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </span>

        <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
          {job?.jobType || "Job"}
        </span>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-4 my-5">
        <CompanyAvatar
          name={job?.company?.name}
          logo={job?.company?.logo}
          size={44}
        />
        <div className="min-w-0">
          <h1 className="font-semibold text-gray-800">
            {job?.company?.name || "Company"}
          </h1>
          <p className="text-xs text-gray-500">
            {job?.location || "India"}
          </p>
        </div>
      </div>

      {/* Job Title & Description */}
      <div>
        <h1 className="font-bold text-lg text-gray-900 mb-1 leading-tight">
          {job?.title}
        </h1>
        <p className="text-gray-600 text-sm line-clamp-2">
          {job?.description}
        </p>
      </div>

      {/* Job Details Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {/* Experience */}
        <Badge
          variant="outline"
          className="text-blue-700 border-blue-200 font-semibold"
        >
          {job?.experienceLevel
            ? `${job.experienceLevel}+ yrs exp`
            : "Experience NA"}
        </Badge>

        {/* Job Type */}
        <Badge
          variant="outline"
          className="text-[#F83002] border-[#FDDAD4] font-semibold capitalize"
        >
          {job?.jobType}
        </Badge>

        {/* Salary */}
        <Badge
          variant="outline"
          className="text-[#7209b7] border-[#e9d5ff] font-semibold"
        >
          {formatSalary(job?.salary)}
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-6">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="flex-1 text-sm hover:bg-gray-50"
        >
          View Details
        </Button>

        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          className="flex-1 bg-[#7209b7] hover:bg-[#5c0991] 
                     text-white text-sm shadow-md"
        >
          Apply Now
        </Button>
      </div>
    </motion.div>
  );
};

export default Job;
