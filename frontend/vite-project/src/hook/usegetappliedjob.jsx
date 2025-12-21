import { setAllAppliedJobs } from "../redux/jobslice.js";
import { APPLICATION_API_END_POINT } from "../utils/constant.js";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/get`,
          { withCredentials: true }
        );
   
        console.log("API Response for applied jobs:", res.data); 
        if (res.data.success) {
        dispatch(setAllAppliedJobs(res.data.applications || []));

        }
      } catch (error) {
        console.log("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [dispatch]);
};

export default useGetAppliedJobs;
