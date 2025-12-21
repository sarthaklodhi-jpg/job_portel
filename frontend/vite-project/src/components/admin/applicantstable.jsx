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
import { MoreHorizontal, FileText, CheckCircle, XCircle } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { motion } from "framer-motion";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const applications = useSelector(
    (state) => state.application?.applications || []
  );

  // STATUS UPDATE HANDLER (unchanged)
  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Status updated successfully");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating status");
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Table>
        <TableCaption className="text-gray-500">
          A list of candidates who applied for this job
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium text-gray-600">
              Full Name
            </TableHead>
            <TableHead className="font-medium text-gray-600">
              Email
            </TableHead>
            <TableHead className="font-medium text-gray-600">
              Contact
            </TableHead>
            <TableHead className="font-medium text-gray-600">
              Resume
            </TableHead>
            <TableHead className="font-medium text-gray-600">
              Applied On
            </TableHead>
            <TableHead className="text-right font-medium text-gray-600">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-600">
                    No applicants yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Applications will appear here once candidates apply.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            applications.map((item, index) => (
              <motion.tr
                key={item?._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="group hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium text-gray-800">
                  {item?.applicant?.fullName || "-"}
                </TableCell>

                <TableCell className="text-gray-600">
                  {item?.applicant?.email || "-"}
                </TableCell>

                <TableCell className="text-gray-600">
                  {item?.applicant?.phone || "-"}
                </TableCell>

                <TableCell>
                  {item?.resume ? (
                    <a
                      href={item.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      View Resume
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>

                <TableCell className="text-sm text-gray-500">
                  {item?.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>

                {/* ACTIONS */}
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-md hover:bg-gray-100 transition">
                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent align="end" className="w-40 p-1">
                      <button
                        onClick={() =>
                          statusHandler("Accepted", item?._id)
                        }
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-gray-100 transition"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          statusHandler("Rejected", item?._id)
                        }
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-gray-100 transition"
                      >
                        <XCircle className="h-4 w-4 text-red-600" />
                        Reject
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

export default ApplicantsTable;
