import React from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";

const randomJobs = [1, 2, 3, 4, 5, 6, 7];

const Browse = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto my-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Search Results <span className="text-[#6A38C2]">({randomJobs.length})</span>
        </h1>

        {randomJobs.length === 0 ? (
          <div className="flex items-center justify-center text-gray-500 text-lg font-medium h-[50vh]">
            No jobs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {randomJobs.map((item, index) => (
              <Job key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
