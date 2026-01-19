import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== AUTH GUARD ===== */
  if (!user) return <Navigate to="/login" />;
  if (!user.isProfileComplete) return <Navigate to="/complete-profile" />;
  if (user.role !== "student") return <Navigate to="/" />;

  /* ===== FETCH JOBS ===== */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          withCredentials: true,
        });
        setJobs(res.data.jobs || []);
      } catch {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        Welcome, {user.fullname} 👋
      </h1>
      <p className="text-gray-600 mb-6">
        Browse jobs and apply easily
      </p>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500">No jobs available</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-xl p-5 shadow-sm bg-white"
            >
              <h2 className="font-semibold text-lg">{job.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {job.location} • {job.jobType}
              </p>

              <div className="mt-4 flex gap-3">
                <Button
                  size="sm"
                  onClick={() => navigate(`/description/${job._id}`)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/description/${job._id}`)}
                >
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
