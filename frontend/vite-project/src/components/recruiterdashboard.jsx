import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  EmptyState,
  GradientHero,
  PageShell,
  SectionCard,
  StatCard,
} from "./shared/dashboard-primitives";

const RecruiterDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!user || !user.isProfileComplete || user.role !== "recruiter") return;

    const fetchRecruiterData = async () => {
      try {
        const [companyRes, jobRes] = await Promise.all([
          axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true }),
          axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true }),
        ]);

        setCompanies(companyRes.data.companies || []);
        setJobs(jobRes.data.jobs || []);
      } catch {
        toast.error("Failed to load recruiter data");
      }
    };

    fetchRecruiterData();
  }, [user]);

  if (!user) return <Navigate to="/login" />;
  if (!user.isProfileComplete) return <Navigate to="/complete-profile" />;
  if (user.role !== "recruiter") return <Navigate to="/" />;

  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (job.applications?.length || 0),
    0
  );
  const recentJobsWithApplicants = jobs
    .filter((job) => job.applications?.length)
    .slice(0, 4);

  return (
    <PageShell>
      <GradientHero
        title="Recruiter Dashboard"
        subtitle="Manage companies, jobs, and applicants with one unified workspace."
        right={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate("/admin/companies/create")}>
              Create Company
            </Button>
            <Button variant="secondary" onClick={() => navigate("/admin/jobs/create")}>
              Post Job
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3 my-6">
        <StatCard label="Companies" value={companies.length} />
        <StatCard label="Posted Jobs" value={jobs.length} />
        <StatCard label="Applicants" value={totalApplicants} />
      </div>

      <SectionCard title="Your Companies" className="mb-6">
        {companies.length === 0 ? (
          <EmptyState message="No companies created yet." />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
          {companies.map((company) => (
            <div key={company._id} className="border rounded-xl p-4 bg-white">
              <h3 className="font-medium">{company.name}</h3>
              <p className="text-sm text-gray-500">{company.location || "Location not added"}</p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => navigate(`/admin/companies/${company._id}`)}
              >
                Manage
              </Button>
            </div>
          ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Your Jobs" className="mb-6">
        {jobs.length === 0 ? (
          <EmptyState message="No jobs posted yet." />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="border rounded-xl p-4 bg-white">
              <h3 className="font-medium">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.location}</p>
              <p className="text-sm text-gray-500">
                {job.applications?.length || 0} applicant(s)
              </p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
              >
                View Applicants
              </Button>
            </div>
          ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Recent Applications">
        {recentJobsWithApplicants.length === 0 ? (
          <EmptyState message="No applications received yet." />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
          {recentJobsWithApplicants.map((job) => (
            <div key={job._id} className="border rounded-xl p-4 bg-white">
              <h3 className="font-medium">{job.title}</h3>
              <p className="text-sm text-gray-500">
                {job.applications.length} applicant(s)
              </p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
              >
                Review
              </Button>
            </div>
          ))}
          </div>
        )}
      </SectionCard>
    </PageShell>
  );
};

export default RecruiterDashboard;
