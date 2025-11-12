import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import useGetAllJobs from "../hook/usegetalljobs.jsx";

const LatestJobs = () => {
   // ✅ call the custom hook to fetch jobs
  useGetAllJobs();
  // ✅ correct key name
  const { allJobs } = useSelector((state) => state.job);

 

  return (
    <section className="w-full bg-gradient-to-b from-white via-[#f9f6ff] to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10">
          <span className="text-[#6A38C2]">Latest & Top </span>
          <span className="text-black">Job Openings</span>
        </h1>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {allJobs.length <= 0 ? (
            <span>No Jobs Found</span>
          ) : (
            allJobs.slice(0, 6).map((job) => (
              <LatestJobCards key={job._id} job={job} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
