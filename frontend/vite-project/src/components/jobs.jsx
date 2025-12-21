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
      className="min-h-screen bg-gradient-to-b from-white via-[#f9f6ff] to-white"
    >
      <Navbar />

      <div className="max-w-7xl mx-auto mt-10 px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar */}
          <motion.div
            variants={sidebarVariant}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-[25%]"
          >
            <FilterCard />
          </motion.div>

          {/* Jobs */}
          <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
            <AnimatePresence mode="wait">
              {filteredJobs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center text-gray-500 text-lg font-medium h-full"
                >
                  No Jobs Found
                </motion.div>
              ) : (
                <motion.div
                  key="jobs"
                  variants={containerVariant}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
