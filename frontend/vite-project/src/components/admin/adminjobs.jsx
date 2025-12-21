import React, { useEffect, useState } from "react";
import Navbar from "../shared/navbar.jsx";
import { Input } from "../ui/input.jsx";
import { Button } from "../ui/button.jsx";
import AdminJobsTable from "./adminjobtable.jsx";
import { useNavigate } from "react-router-dom";
import useGetAllAdminJobs from "@/hook/usegetalladminjobs.jsx";
import { useDispatch } from "react-redux";
import { setSearchjobByText } from "@/redux/jobslice.js";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";

const AdminJobs = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch only admin jobs
  useGetAllAdminJobs();

  // Update search text inside redux
  useEffect(() => {
    dispatch(setSearchjobByText(input));
  }, [input, dispatch]);

  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Manage Jobs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View, search, and manage all jobs you have posted.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 h-10"
              placeholder="Search jobs by title..."
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Create Job */}
          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="h-10 px-5 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Job
          </Button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <AdminJobsTable />
        </div>
      </motion.div>
    </>
  );
};

export default AdminJobs;
