import React from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";

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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={() => navigate(`/description/${job._id}`)}
      className="premium-card group flex h-full cursor-pointer flex-col justify-between p-6 transition-all duration-200 hover:border-sky-200 hover:shadow-[0_24px_70px_rgba(15,23,42,0.13)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              className="h-12 w-12 rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-sky-700 text-sm font-bold text-white">
              {getCompanyInitials(companyName)}
            </div>
          )}

          <div className="min-w-0">
            <h1 className="truncate font-semibold text-slate-950">{companyName}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {job?.location || "Remote"}
            </p>
          </div>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-sky-100 group-hover:text-sky-700">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold leading-snug tracking-tight text-slate-950">
          {job?.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {job?.description}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="bg-sky-50 px-3 py-1 text-sky-700">
          {job?.position}
        </Badge>
        <Badge variant="secondary" className="bg-teal-50 px-3 py-1 text-teal-700">
          {job?.jobType}
        </Badge>
        <Badge variant="secondary" className="bg-slate-100 px-3 py-1 text-slate-700">
          {job?.salary}
        </Badge>
      </div>
    </motion.div>
  );
};

export default LatestJobCards;
