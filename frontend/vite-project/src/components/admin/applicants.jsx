import React, { useEffect } from "react";
import Navbar from "../shared/navbar";
import Applicantstable from "./applicantstable";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setApplications } from "../../redux/applicationsSlice";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();

  // Safe selector with fallback
  const applications = useSelector(
    (state) => state.application?.applications || []
  );

  useEffect(() => {
    const fetchAllApplications = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );

        // backend returns { applicants: [] }
        dispatch(setApplications(res.data.applicants || []));
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllApplications();
  }, [params.id, dispatch]);

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
              <Users className="h-5 w-5 text-gray-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Applicants
              </h1>
              <p className="text-sm text-gray-500">
                Total applications received:{" "}
                <span className="font-medium text-gray-700">
                  {applications.length}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <Applicantstable />
        </div>
      </motion.div>
    </>
  );
};

export default Applicants;
