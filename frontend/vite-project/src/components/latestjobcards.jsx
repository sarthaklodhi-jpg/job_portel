import React from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ================= Helper: Company Initials ================= */
const getCompanyInitials = (name = "") => {
  if (!name) return "?";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  const companyName = job?.company?.name || "Company";
  const companyLogo = job?.company?.logo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={() => navigate(`/description/${job._id}`)}
      className="w-full h-full p-6 rounded-2xl bg-white border border-gray-100
                 shadow-sm hover:shadow-xl cursor-pointer
                 transition-all flex flex-col justify-between"
    >
      {/* ================= Company Info ================= */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* Company Logo / Initials */}
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              className="w-11 h-11 rounded-full object-cover border"
            />
          ) : (
            <div className="w-11 h-11 rounded-full
                            bg-gradient-to-br from-indigo-500 to-purple-600
                            flex items-center justify-center
                            text-sm font-semibold text-white border">
              {getCompanyInitials(companyName)}
            </div>
          )}

          <div>
            <h1 className="font-semibold text-lg text-gray-800">
              {companyName}
            </h1>
            <p className="text-sm text-gray-500">
              {job?.location || "Remote"}
            </p>
          </div>
        </div>

        <Badge className="bg-[#6A38C2] text-white font-medium px-3 py-1 shadow-sm">
          Hiring
        </Badge>
      </div>

      {/* ================= Job Info ================= */}
      <div className="mt-5">
        <h2 className="font-bold text-xl text-gray-900 leading-snug">
          {job?.title}
        </h2>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
          {job?.description}
        </p>
      </div>

      {/* ================= Tags ================= */}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <Badge
          variant="outline"
          className="text-blue-700 font-semibold border-blue-200
                     bg-blue-50 hover:bg-blue-100"
        >
          {job?.position}
        </Badge>

        <Badge
          variant="outline"
          className="text-[#F83082] font-semibold border-pink-200
                     bg-pink-50 hover:bg-pink-100"
        >
          {job?.jobType}
        </Badge>

        <Badge
          variant="outline"
          className="text-[#7209b7] font-semibold border-purple-200
                     bg-purple-50 hover:bg-purple-100"
        >
          {job?.salary}
        </Badge>
      </div>
    </motion.div>
  );
};

export default LatestJobCards;
