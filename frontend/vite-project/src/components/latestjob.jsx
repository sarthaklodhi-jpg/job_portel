import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import useGetAllJobs from "../hook/usegetalljobs.jsx";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const LatestJobs = () => {
  // ✅ fetch jobs (logic unchanged)
  useGetAllJobs();

  // ✅ correct key name
  const { allJobs } = useSelector((state) => state.job);

  return (
    <section className="relative w-full bg-gradient-to-b from-white via-[#f9f6ff] to-white py-20 px-4 overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#6A38C2]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-12"
        >
          <span className="text-[#6A38C2]">Latest & Top </span>
          <span className="text-gray-900">Job Openings</span>
        </motion.h1>

        {/* Job Cards Grid */}
        {allJobs.length <= 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 text-lg"
          >
            No Jobs Found
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {allJobs.slice(0, 6).map((job) => (
              <motion.div key={job._id} variants={itemVariants}>
                <LatestJobCards job={job} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestJobs;
