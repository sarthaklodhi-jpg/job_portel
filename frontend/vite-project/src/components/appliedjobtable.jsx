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
  const allAppliedJobs =
    useSelector((store) => store.job.allAppliedJobs) || [];

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">
          Applied Jobs
        </h2>
        <p className="text-sm text-gray-500">
          Track the status of jobs you’ve applied for
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="text-gray-400 text-sm py-3">
            A list of your applied jobs
          </TableCaption>

          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-600">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Job Role
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Company
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-600">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allAppliedJobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-12 text-gray-500"
                >
                  You haven’t applied to any jobs yet.
                </TableCell>
              </TableRow>
            ) : (
              allAppliedJobs.map((appliedJob) => (
                <TableRow
                  key={appliedJob._id}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell className="text-gray-600">
                    {appliedJob.createdAt?.split("T")[0]}
                  </TableCell>

                  <TableCell className="font-medium text-gray-800">
                    {appliedJob.job?.title}
                  </TableCell>

                  <TableCell className="text-gray-700">
                    {appliedJob.job?.company?.name}
                  </TableCell>

                  <TableCell className="text-right">
                    <Badge
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${
                          appliedJob.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : appliedJob.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
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
