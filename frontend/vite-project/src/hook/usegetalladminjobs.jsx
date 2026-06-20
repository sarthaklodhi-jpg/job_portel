import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "../utils/constant.js";
import { setAllAdminJobs } from "../redux/jobslice.js";
import { setUser } from "../redux/authslice.js";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user || user.role !== "recruiter" || !user.isProfileComplete) return;

    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          dispatch(setUser(null));
        } else {
          console.error("Error fetching admin jobs:", error);
        }
      }
    };

    fetchAllJobs();
  }, [dispatch, user]);
};

export default useGetAllAdminJobs;
