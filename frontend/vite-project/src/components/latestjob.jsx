import React from "react";
import LatestJobCards from "./latestjobcards";
import { useSelector } from "react-redux";
import useGetAllJobs from "../hook/usegetalljobs.jsx";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const LatestJobs = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((state) => state.job);

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 px-4 py-20">
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="eyebrow">Latest roles</span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            Top job openings for focused career moves
          </h1>
          <p className="mt-4 text-slate-600">
            Browse fresh opportunities from teams actively hiring across product,
            engineering, design, operations, and more.
          </p>
        </motion.div>

        {allJobs.length <= 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="premium-card mx-auto max-w-xl p-10 text-center text-slate-500"
          >
            No jobs found.
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
