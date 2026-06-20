import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, RefreshCcw, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { RESUME_API_END_POINT } from "@/utils/constant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Job from "./job.jsx";

const ListSection = ({ title, items }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
      {title}
    </h3>
    {items?.length ? (
      <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="mt-2 text-sm text-gray-400">No items returned.</p>
    )}
  </div>
);

const ResumeScreening = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const scanResume = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${RESUME_API_END_POINT}/screen`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setResult(res.data);
        toast.success("Resume analysis completed");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to analyze resume";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const analysis = result?.analysis;
  const score = Math.max(0, Math.min(100, Number(analysis?.resumeScore) || 0));
  const recommendedJobs = result?.recommendedJobs || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="premium-card mx-auto mt-10 max-w-5xl p-6 dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Resume AI Analysis
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Scan your uploaded resume and discover matching jobs.
          </p>
        </div>

        <Button
          onClick={scanResume}
          disabled={loading}
          className="text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : error ? (
            <>
              <RefreshCcw className="h-4 w-4" />
              Retry
            </>
          ) : (
            <>
              <ScanSearch className="h-4 w-4" />
              Scan Resume
            </>
          )}
        </Button>
      </div>

      {loading && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-gray-800 dark:bg-gray-900">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-sky-600" />
          <p className="mt-3 text-sm font-medium text-slate-700 dark:text-gray-200">
            Reading your resume and matching jobs...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      {analysis && !loading && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                Resume Score
              </span>
              <span className="font-bold text-sky-700">{score}/100</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-500 transition-all duration-700"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Skills
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.skills?.length ? (
                analysis.skills.map((skill, index) => (
                  <Badge
                    key={`${skill}-${index}`}
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-400">No skills found.</span>
              )}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <ListSection title="Strengths" items={analysis.strengths} />
            <ListSection title="Weaknesses" items={analysis.weaknesses} />
            <ListSection
              title="Improvement Tips"
              items={analysis.improvementTips}
            />
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recommended Jobs
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {recommendedJobs.length} match(es)
              </span>
            </div>

            {recommendedJobs.length ? (
              <div className="grid gap-5 md:grid-cols-2">
                {recommendedJobs.map((job) => (
                  <Job key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                No matching jobs found yet.
              </div>
            )}
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default ResumeScreening;
