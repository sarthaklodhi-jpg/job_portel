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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Building2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import useGetAllCompanies from "../../hook/usegetallcompanies.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant.js";
import { toast } from "sonner";
import { removeCompany } from "@/redux/companyslice.js";

/* ---------------- COMPANY AVATAR (LOGO / INITIALS) ---------------- */

const CompanyAvatar = ({ name, logo }) => {
  const initials = name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar className="h-10 w-10 border bg-gray-100">
      {logo ? (
        <AvatarImage
          src={logo}
          alt={name}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-700">
          {initials || "C"}
        </div>
      )}
    </Avatar>
  );
};

/* ---------------- COMPANIES TABLE ---------------- */

const CompaniesTable = () => {
  useGetAllCompanies();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );

  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    const filtered = companies?.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name
        ?.toLowerCase()
        .includes(searchCompanyByText.toLowerCase());
    });

    setFilteredCompanies(filtered);
  }, [searchCompanyByText, companies]);

  /* ---------------- DELETE COMPANY ---------------- */

  const deleteCompanyHandler = async (companyId) => {
    try {
      const res = await axios.delete(
        `${COMPANY_API_END_POINT}/delete/${companyId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(removeCompany(companyId)); // 🔥 instant UI update
        toast.success("Company deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete company"
      );
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Table>
        <TableCaption className="text-gray-500">
          Companies registered on your platform
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium text-gray-600">
              Logo
            </TableHead>
            <TableHead className="font-medium text-gray-600">
              Company
            </TableHead>
            <TableHead className="font-medium text-gray-600">
              Created On
            </TableHead>
            <TableHead className="text-right font-medium text-gray-600">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCompanies?.length > 0 ? (
            filteredCompanies.map((company, index) => (
              <motion.tr
                key={company._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="group hover:bg-gray-50 transition-colors"
              >
                {/* Logo / Initials */}
                <TableCell>
                  <CompanyAvatar
                    name={company.name}
                    logo={company.logo}
                  />
                </TableCell>

                {/* Name */}
                <TableCell className="font-medium text-gray-800">
                  {company.name}
                </TableCell>

                {/* Date */}
                <TableCell className="text-sm text-gray-500">
                  {new Date(company.createdAt).toLocaleDateString()}
                </TableCell>

                {/* Actions */}
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
                          navigate(`/admin/companies/${company._id}`)
                        }
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-gray-100 transition"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteCompanyHandler(company._id)
                        }
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </motion.tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Building2 className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-600">
                    No companies found
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try adjusting your search or add a new company.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
