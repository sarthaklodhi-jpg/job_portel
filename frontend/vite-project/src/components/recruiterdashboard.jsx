import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  COMPANY_API_END_POINT,
  JOB_API_END_POINT,
} from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RecruiterDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);

  /* ===== AUTH GUARD ===== */
  if (!user) return <Navigate to="/login" />;
  if (!user.isProfileComplete) return <Navigate to="/complete-profile" />;
  if (user.role !== "recruiter") return <Navigate to="/" />;

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const [companyRes, jobRes] = await Promise.all([
          axios.get(`${COMPANY_API_END_POINT}/get`, {
            withCredentials: true,
          }),
          axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
            withCredentials: true,
          }),
        ]);

        setCompanies(companyRes.data.companies || []);
        setJobs(jobRes.data.jobs || []);
      } catch {
        toast.error("Failed to load recruiter data");
      }
    };

    fetchRecruiterData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        Recruiter Dashboard 👔
      </h1>
      <p className="text-gray-600 mb-6">
        Manage companies, jobs & applicants
      </p>

      {/* ===== ACTION BUTTONS ===== */}
      <div className="flex gap-4 mb-8">
        <Button onClick={() => navigate("/admin/companies/create")}>
          Create Company
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/jobs/create")}
        >
          Post Job
        </Button>
      </div>

      {/* ===== COMPANIES ===== */}
      <h2 className="text-xl font-semibold mb-3">Your Companies</h2>
      {companies.length === 0 ? (
        <p className="text-gray-500 mb-6">No companies created</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {companies.map((company) => (
            <div
              key={company._id}
              className="border rounded-xl p-4 bg-white"
            >
              <h3 className="font-medium">{company.name}</h3>
              <p className="text-sm text-gray-500">
                {company.location}
              </p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() =>
                  navigate(`/admin/companies/${company._id}`)
                }
              >
                Manage
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ===== JOBS ===== */}
      <h2 className="text-xl font-semibold mb-3">Your Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-xl p-4 bg-white"
            >
              <h3 className="font-medium">{job.title}</h3>
              <p className="text-sm text-gray-500">
                {job.location}
              </p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() =>
                  navigate(`/admin/jobs/${job._id}/applicants`)
                }
              >
                View Applicants
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
