import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table.jsx";
import { Badge } from "./ui/badge.jsx";
import { useSelector } from "react-redux";

const AppliedJobTable = () => {
  const allAppliedJobs = useSelector((store) => store.job.allAppliedJobs) || [];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-950">Applied Jobs</h2>
        <p className="text-sm text-slate-500">Track the status of jobs you've applied for</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="py-3 text-sm text-slate-400">
            A list of your applied jobs
          </TableCaption>

          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Date</TableHead>
              <TableHead>Job Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allAppliedJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-slate-500">
                  You haven't applied to any jobs yet.
                </TableCell>
              </TableRow>
            ) : (
              allAppliedJobs.map((appliedJob) => (
                <TableRow key={appliedJob._id} className="transition hover:bg-slate-50">
                  <TableCell className="text-slate-600">
                    {appliedJob.createdAt?.split("T")[0]}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    {appliedJob.job?.title}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {appliedJob.job?.company?.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      className={`px-3 py-1 text-xs font-semibold ${
                        appliedJob.status === "accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : appliedJob.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {appliedJob.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AppliedJobTable;
