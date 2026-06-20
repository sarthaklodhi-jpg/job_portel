import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Clock3, IndianRupee, MapPin } from "lucide-react";
import CompanyAvatar from "./shared/companyavatar";

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  const formatSalary = (salary) => {
    if (!salary) return "Salary not disclosed";
    if (salary >= 100000) return `₹${(salary / 100000).toFixed(1)} LPA`;
    return `₹${salary}`;
  };

  const daysAgo = daysAgoFunction(job?.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="premium-card flex h-full flex-col p-5 transition-all duration-200 hover:border-sky-200 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]"
    >
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1 font-medium">
          <Clock3 className="h-3.5 w-3.5" />
          {daysAgo === 0 ? "Today" : `${daysAgo} days ago`}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
          {job?.jobType || "Job"}
        </span>
      </div>

      <div className="my-5 flex items-center gap-4">
        <CompanyAvatar name={job?.company?.name} logo={job?.company?.logo} size={44} />
        <div className="min-w-0">
          <h1 className="truncate font-semibold text-slate-950">
            {job?.company?.name || "Company"}
          </h1>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {job?.location || "India"}
          </p>
        </div>
      </div>

      <div className="flex-1">
        <h1 className="mb-2 text-lg font-bold leading-tight tracking-tight text-slate-950">
          {job?.title}
        </h1>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {job?.description}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-sky-50 text-sky-700">
          <Briefcase className="h-3 w-3" />
          {job?.experienceLevel ? `${job.experienceLevel}+ yrs` : "Experience NA"}
        </Badge>
        <Badge variant="secondary" className="bg-teal-50 text-teal-700 capitalize">
          {job?.jobType}
        </Badge>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700">
          <IndianRupee className="h-3 w-3" />
          {formatSalary(job?.salary).replace("₹", "")}
        </Badge>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="text-sm"
        >
          Details
        </Button>
        <Button onClick={() => navigate(`/description/${job?._id}`)} className="text-sm">
          Apply
        </Button>
      </div>
    </motion.div>
  );
};

export default Job;
