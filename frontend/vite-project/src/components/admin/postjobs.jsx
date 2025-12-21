import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { JOB_API_END_POINT } from "../../utils/constant.js";
import { motion } from "framer-motion";
import { Briefcase, Loader2 } from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const companies = useSelector((store) => store.company.companies);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    if (selectedCompany) {
      setInput({ ...input, companyId: selectedCompany._id });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.companyId) {
      alert("Please select a company before posting the job.");
      return;
    }

    if (input.position === "") {
      alert("Please enter number of positions");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        alert("Job posted successfully!");
        navigate("/admin/jobs");
      } else {
        alert("Failed to post job. Please try again.");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Briefcase className="h-6 w-6 text-gray-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Post a New Job
              </h1>
              <p className="text-sm text-gray-500 mt-1 max-w-lg">
                Fill in the details below to publish a new job opening. You can
                edit this later if needed.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label>Job Title</Label>
                <Input
                  name="title"
                  value={input.title}
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
                <Label>Requirements</Label>
                <Input
                  name="requirements"
                  value={input.requirements}
                  onChange={changeEventHandler}
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label>Salary</Label>
                <Input
                  name="salary"
                  value={input.salary}
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

              <div>
                <Label>Job Type</Label>
                <Input
                  name="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label>Experience</Label>
                <Input
                  name="experience"
                  value={input.experience}
                  onChange={changeEventHandler}
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label>Open Positions</Label>
                <Input
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  className="h-11 mt-1"
                />
              </div>

              {/* Company */}
              <div className="sm:col-span-2">
                <Label>Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="mt-1 h-11">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {companies.length > 0 &&
                        companies.map((company) => (
                          <SelectItem
                            key={company._id}
                            value={company.name.toLowerCase()}
                          >
                            {company.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {companies.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    Please create a company before posting a job.
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="mt-10">
              {loading ? (
                <Button className="w-full h-11" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting job...
                </Button>
              ) : (
                <Button type="submit" className="w-full h-11">
                  Submit Job
                </Button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default PostJob;
