import React, { useEffect } from "react";
import Navbar from "../components/shared/navbar";

import Job from "./job";
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
      className="app-bg"
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.h1
          variants={headingVariant}
          initial="hidden"
          animate="visible"
          className="mb-6 text-3xl font-bold tracking-tight text-slate-950"
        >
          Search Results{" "}
          <span className="text-sky-600">({allJobs.length})</span>
        </motion.h1>

        {/* Results */}
        <AnimatePresence mode="wait">
          {allJobs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="premium-card flex min-h-[360px] items-center justify-center text-lg font-medium text-slate-500"
            >
              No jobs found.
            </motion.div>
          ) : (
            <motion.div
              key="jobs"
              variants={containerVariant}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
