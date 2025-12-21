import React, { useEffect, useState } from "react";
import Navbar from "../shared/navbar.jsx";
import { Input } from "../ui/input.jsx";
import { Button } from "../ui/button.jsx";
import Companiestable from "./companiestable.jsx";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hook/usegetallcompanies.jsx";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companyslice.js";
import { motion } from "framer-motion";
import { Building2, Plus, Search } from "lucide-react";

const Companies = () => {
  useGetAllCompanies();

  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <Building2 className="h-5 w-5 text-gray-600" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                Companies
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage companies registered on your platform.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 h-10"
              placeholder="Search by company name..."
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Create Company */}
          <Button
            onClick={() => navigate("/admin/companies/create")}
            className="h-10 px-5 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Company
          </Button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <Companiestable />
        </div>
      </motion.div>
    </>
  );
};

export default Companies;
