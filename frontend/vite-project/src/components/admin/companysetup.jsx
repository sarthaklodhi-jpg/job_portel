import React, { useState, useEffect } from "react";
import Navbar from "../shared/navbar";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "../../utils/constant.js";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "../../hook/usegetcompanybyid.jsx";
import { motion } from "framer-motion";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);

  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const singlecompany = useSelector((state) => state.company);
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("name", input.name);
    formdata.append("description", input.description);
    formdata.append("website", input.website);
    formdata.append("location", input.location);
    if (input.file) {
      formdata.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Company updated successfully!");
        navigate("/admin/companies");
      }
    } catch (error) {
      console.error("Error updating company:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singlecompany.name || "",
      description: singlecompany.description || "",
      website: singlecompany.website || "",
      location: singlecompany.location || "",
      file: singlecompany.file || null,
    });
  }, [singlecompany]);

  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/companies")}
          className="mb-6 flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Button>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Building2 className="h-6 w-6 text-gray-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Company Settings
              </h1>
              <p className="text-sm text-gray-500 mt-1 max-w-md">
                Update your company information. These details will be visible
                across the platform.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label>Company Name</Label>
                <Input
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label>Website</Label>
                <Input
                  name="website"
                  value={input.website}
                  onChange={changeEventHandler}
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  className="h-11 mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <Label>Company Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="mt-10">
              {loading ? (
                <Button className="w-full h-11" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving changes...
                </Button>
              ) : (
                <Button type="submit" className="w-full h-11">
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default CompanySetup;
