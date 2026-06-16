import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useGetAppliedJobs from "@/hook/usegetappliedjob";
import {
  EmptyState,
  GradientHero,
  PageShell,
  SectionCard,
  SkeletonGrid,
  StatCard,
} from "./shared/dashboard-primitives";

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const appliedJobs = useSelector((state) => state.job.allAppliedJobs || []);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useGetAppliedJobs();

  useEffect(() => {
    if (!user || !user.isProfileComplete || user.role !== "student") return;

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/gets`, {
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
  }, [user]);

  if (!user) return <Navigate to="/login" />;
  if (!user.isProfileComplete) return <Navigate to="/complete-profile" />;
  if (user.role !== "student") return <Navigate to="/" />;

  const profileFields = [
    user.fullname,
    user.email,
    user.phoneNumber,
    user.profile?.bio,
    user.profile?.skills?.length,
    user.profile?.resume || user.profile?.resumeDownloadUrl,
  ];
  const completion = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100
  );
  const latestJobs = jobs.slice(0, 6);

  return (
    <PageShell>
      <GradientHero
        title={`Welcome, ${user.fullname}`}
        subtitle="Track applications, keep your profile ready, and discover new roles."
      />

      <div className="grid gap-4 md:grid-cols-3 my-6">
        <StatCard label="Applied Jobs" value={appliedJobs.length} />
        <StatCard label="Profile Complete" value={`${completion}%`} />
        <StatCard label="Latest Jobs" value={latestJobs.length} />
      </div>

      {!user.profile?.resumeDownloadUrl && !user.profile?.resumeViewUrl && !user.profile?.resumeUrl && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-semibold text-amber-900">Resume missing</h2>
            <p className="text-sm text-amber-800">
              Upload a resume so recruiters can review your application.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/profile")}>
            Upload Resume
          </Button>
        </div>
      )}

      <SectionCard title="Latest Jobs">
        {loading ? (
          <SkeletonGrid count={3} />
        ) : latestJobs.length === 0 ? (
          <EmptyState message="No jobs available yet." />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
              <div key={job._id} className="border rounded-xl p-5 shadow-sm bg-white">
              <h2 className="font-semibold text-lg">{job.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {job.location} | {job.jobType}
              </p>

              <div className="mt-4 flex gap-3">
                <Button size="sm" onClick={() => navigate(`/description/${job._id}`)}>
                  View Details
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
      </SectionCard>
    </PageShell>
  );
};

export default StudentDashboard;
