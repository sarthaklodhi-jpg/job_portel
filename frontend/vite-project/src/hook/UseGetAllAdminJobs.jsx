import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { JOB_API_END_POINT } from "../utils/constant.js";
import { setAllAdminJobs } from "../redux/jobslice.js"

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
          withCredentials: true,
        });

        console.log("API Response:", res.data); 

        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllAdminJobs;
