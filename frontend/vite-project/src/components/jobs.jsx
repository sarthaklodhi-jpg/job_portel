import React from "react";
import Navbar from "./shared/navbar.jsx";
import FilterCard from "./FilterCard.jsx";
import Job from "./job.jsx";
import { useSelector } from "react-redux";
import useGetAllJobs from "../hook/useGetAllJobs.jsx"; // ✅ fixed hook name

const Jobs = () => {
  // ✅ Correct key name (allJobs, not alljobs)
  const { allJobs } = useSelector((state) => state.job);

  // ✅ Call your custom hook to fetch jobs
  useGetAllJobs();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f9f6ff] to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-10 px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 🧭 Sidebar Filter */}
          <div className="w-full lg:w-[25%]">
            <FilterCard />
          </div>

          {/* 💼 Jobs Section */}
          <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
            {allJobs.length <= 0 ? (
              <div className="flex items-center justify-center text-gray-500 text-lg font-medium h-full">
                No Jobs Found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allJobs.map((job) => (
                  <div key={job?._id}>
                    <Job job={job} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
