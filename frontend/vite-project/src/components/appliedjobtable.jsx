import React from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Badge } from "./ui/badge"

const appliedJobs = [
  {
    id: 1,
    date: "17-07-2024",
    role: "Frontend Developer",
    company: "Google",
    status: "Selected",
  },
  {
    id: 2,
    date: "21-08-2024",
    role: "Backend Developer",
    company: "Microsoft",
    status: "Pending",
  },
  {
    id: 3,
    date: "02-09-2024",
    role: "UI/UX Designer",
    company: "Figma",
    status: "Rejected",
  },
  {
    id: 4,
    date: "15-10-2024",
    role: "Full Stack Developer",
    company: "Amazon",
    status: "Interview",
  },
]

const AppliedJobTable = () => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <Table>
        <TableCaption className="text-gray-500 text-sm mt-2">
          A list of your applied jobs
        </TableCaption>

        {/* Header */}
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-100">
            <TableHead className="font-semibold text-gray-700">Date</TableHead>
            <TableHead className="font-semibold text-gray-700">Job Role</TableHead>
            <TableHead className="font-semibold text-gray-700">Company</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Status</TableHead>
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {appliedJobs.map((job) => (
            <TableRow
              key={job.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <TableCell className="text-gray-600">{job.date}</TableCell>
              <TableCell className="text-gray-800 font-medium">{job.role}</TableCell>
              <TableCell className="text-gray-600">{job.company}</TableCell>
              <TableCell className="text-right">
                <Badge
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    job.status === "Selected"
                      ? "bg-green-100 text-green-700"
                      : job.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : job.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {job.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AppliedJobTable
