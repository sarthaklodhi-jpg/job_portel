import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  MoreHorizontal,
  Edit2,
  Users,
  Briefcase,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hook/usegetalljobs.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { JOB_API_END_POINT } from "../../utils/constant.js";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { removeJob } from "../../redux/jobslice.js";
/* ---------------- COMPANY AVATAR (LOGO / INITIALS) ---------------- */

const CompanyAvatar = ({ name, logo }) => {
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar className="h-9 w-9 border bg-gray-100">
      {logo ? (
        <AvatarImage src={logo} alt={name} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-700">
          {initials || "C"}
        </div>
      )}
    </Avatar>
  );
};

/* ---------------- ADMIN JOBS TABLE ---------------- */

const AdminJobsTable = () => {
  useGetAllJobs();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allAdminJobs, searchJobByText } = useSelector(
    (store) => store.job
  );

  const [filterJobs, setFilterJobs] = useState([]);

  useEffect(() => {
    const data = allAdminJobs?.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.title
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase()) ||
        job?.company?.name
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(data);
  }, [allAdminJobs, searchJobByText]);

  /* ---------------- DELETE JOB ---------------- */

  const deleteJobHandler = async (jobId) => {
    try {
      const res = await axios.delete(
        `${JOB_API_END_POINT}/delete/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(removeJob(jobId));
        toast.success("Job deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete job"
      );
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Table>
        <TableCaption className="text-gray-500">
          A list of your recently posted jobs
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Posted On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterJobs?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Briefcase className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-600">
                    No jobs found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job, index) => (
              <motion.tr
                key={job._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="hover:bg-gray-50"
              >
                {/* Company */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <CompanyAvatar
                      name={job?.company?.name}
                      logo={job?.company?.logo}
                    />
                    <span className="font-medium">
                      {job?.company?.name}
                    </span>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>{job?.title}</TableCell>

                {/* Date */}
                <TableCell>
                  {job?.createdAt?.split("T")[0]}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-md">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent align="end" className="w-40 p-1">
                      <button
                        onClick={() =>
                         navigate(`/admin/jobs/${job._id}`)

                        }
                        className="flex w-full items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded-md"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/jobs/${job._id}/applicants`
                          )
                        }
                        className="flex w-full items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded-md"
                      >
                        <Users className="h-4 w-4" />
                        Applicants
                      </button>

                      <button
                        onClick={() => deleteJobHandler(job._id)}
                        className="flex w-full items-center gap-2 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;