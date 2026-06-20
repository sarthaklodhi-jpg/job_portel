import React from "react";
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
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { downloadResume, getResumeName, getResumeUrl, openResume } from "@/utils/resume";
import { updateApplicationStatus } from "@/redux/applicationsSlice";

const ApplicantsTable = () => {
  const dispatch = useDispatch();

  const applications = useSelector(
    (state) => state.application?.applications || []
  );

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(
          updateApplicationStatus({
            id,
            status: res.data.updatedStatus, // always backend truth
          })
        );

        toast.success(`Application ${res.data.updatedStatus}`);
      }
    } catch {
      toast.error("Error updating status");
    }
  };

  return (
    <Table>
      <TableCaption>
        A list of candidates who applied for this job
      </TableCaption>

      <TableHeader>
        <TableRow className="bg-slate-50">
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Resume</TableHead>
          <TableHead>Applied On</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
<TableBody>
  {applications.length === 0 ? (
    <TableRow>
      <TableCell colSpan={7} className="py-14 text-center text-slate-500">
        No applicants found for this job yet.
      </TableCell>
    </TableRow>
  ) : applications.map((item) => (
    <TableRow key={item._id}>
      <TableCell>{item.applicant?.fullname || "-"}</TableCell>

      <TableCell>{item.applicant?.email || "-"}</TableCell>

      <TableCell>
        {item.applicant?.phoneNumber || "-"}
      </TableCell>

      <TableCell>
        {getResumeUrl(item.applicant?.profile) ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openResume(item.applicant?.profile)}
              className="font-semibold text-sky-700 underline underline-offset-4"
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => downloadResume(item.applicant?.profile)}
              className="font-semibold text-sky-700 underline underline-offset-4"
            >
              {getResumeName(item.applicant?.profile)}
            </button>
          </div>
        ) : (
          "-"
        )}
      </TableCell>

      <TableCell>
        {new Date(item.createdAt).toLocaleDateString()}
      </TableCell>

      <TableCell>
        {item.status === "pending" && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Pending
          </span>
        )}
        {item.status === "accepted" && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Accepted
          </span>
        )}
        {item.status === "rejected" && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Rejected
          </span>
        )}
      </TableCell>

      <TableCell className="text-right">
        {item.status === "pending" ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-40">
              <button
                onClick={() => statusHandler("accepted", item._id)}
                className="flex w-full items-center gap-2 rounded px-2 py-2 hover:bg-slate-100"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
                Accept
              </button>

              <button
                onClick={() => statusHandler("rejected", item._id)}
                className="flex w-full items-center gap-2 rounded px-2 py-2 hover:bg-slate-100"
              >
                <XCircle className="h-4 w-4 text-red-600" />
                Reject
              </button>
            </PopoverContent>
          </Popover>
        ) : (
          <span className="text-sm text-gray-500">
            Decision finalized
          </span>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

    </Table>
  );
};

export default ApplicantsTable;
