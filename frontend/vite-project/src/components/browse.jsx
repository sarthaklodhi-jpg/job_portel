import React, { useEffect } from "react";
import Navbar from "../shared/navbar";

import Job from "./Job";
import { useSelector, useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobslice.js";
import useGetAllJobs from "@/hook/usegetalljobs";
import { motion, AnimatePresence } from "framer-motion";

/* ================= ANIMATION VARIANTS ================= */

const pageVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const headingVariant = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
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

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <motion.div
      variants={pageVariant}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto my-10 px-4">
        {/* Heading */}
        <motion.h1
          variants={headingVariant}
          initial="hidden"
          animate="visible"
          className="text-3xl font-bold mb-6 text-gray-800"
        >
          Search Results{" "}
          <span className="text-[#6A38C2]">({allJobs.length})</span>
        </motion.h1>

        {/* Results */}
        <AnimatePresence mode="wait">
          {allJobs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center text-gray-500 text-lg font-medium h-[50vh]"
            >
              No jobs found.
            </motion.div>
          ) : (
            <motion.div
              key="jobs"
              variants={containerVariant}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {allJobs.map((job) => (
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
    </motion.div>
  );
};

export default Browse;
