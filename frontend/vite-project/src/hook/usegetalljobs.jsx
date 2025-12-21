import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllJobs } from "../redux/jobslice.js";
import { JOB_API_END_POINT } from "../utils/constant.js";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector(store => store.job);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/gets?keyword=${searchedQuery}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchAllJobs();
  }, [dispatch, searchedQuery]); // ✅ FIX
};

export default useGetAllJobs;
