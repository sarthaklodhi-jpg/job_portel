import React, { useEffect, useState } from "react";
import Navbar from "./shared/navbar";
import FilterCard from "./FilterCard";
import Job from "./job.jsx";
import { useSelector } from "react-redux";
import useGetAllJobs from "../hook/usegetalljobs.jsx";
import { motion, AnimatePresence } from "framer-motion";

/* ================= ANIMATION VARIANTS ================= */

const pageVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sidebarVariant = {
  hidden: { x: -40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.95 },
};

const Jobs = () => {
  useGetAllJobs();

  const { allJobs, searchedQuery } = useSelector((state) => state.job);
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    if (searchedQuery?.trim()) {
      const filtered = allJobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchedQuery.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <motion.div
      variants={pageVariant}
      initial="hidden"
      animate="visible"
      className="app-bg"
    >
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="eyebrow">Find roles</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Browse Jobs</h1>
          <p className="mt-2 text-slate-600">Filter openings by location, industry, salary, and your current search.</p>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          
          {/* Sidebar */}
          <motion.div
            variants={sidebarVariant}
            initial="hidden"
            animate="visible"
            className="w-full lg:sticky lg:top-24 lg:w-[280px] lg:self-start"
          >
            <FilterCard />
          </motion.div>

          {/* Jobs */}
          <div className="flex-1 pb-5 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
            <AnimatePresence mode="wait">
              {filteredJobs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="premium-card flex min-h-[360px] items-center justify-center text-lg font-medium text-slate-500"
                >
                  No Jobs Found
                </motion.div>
              ) : (
                <motion.div
                  key="jobs"
                  variants={containerVariant}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job._id}
                      variants={cardVariant}
                      whileHover={{
                        y: -6,
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Jobs;
