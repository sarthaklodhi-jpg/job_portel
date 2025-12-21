import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "../../utils/constant.js";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companyslice";
import { motion } from "framer-motion";
import { Building2, ArrowRight, ArrowLeft, Image } from "lucide-react";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState(null);

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Company name is required!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("companyName", companyName);

      // ✅ OPTIONAL logo upload
      if (logo) {
        formData.append("file", logo);
      }

      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message || "Company registered successfully!");
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error(error.response?.data?.message || "Failed to create company!");
    }
  };

  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
      >
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Building2 className="h-6 w-6 text-gray-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Create your company
              </h1>
              <p className="text-sm text-gray-500 mt-1 max-w-md">
                Enter company details. You can update them later.
              </p>
            </div>
          </div>

          {/* Company Name */}
          <div className="space-y-2 mb-6">
            <Label>Company name</Label>
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Jio, JobHunt, Microsoft etc."
              className="h-11"
            />
          </div>

          {/* Company Logo */}
          <div className="space-y-2">
            <Label>Company logo (optional)</Label>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0])}
                className="h-11"
              />
              <Image className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-10">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>

            <Button
              onClick={registerNewCompany}
              className="flex items-center gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CompanyCreate;
