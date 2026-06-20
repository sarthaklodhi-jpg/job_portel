import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCompanies } from "../redux/companyslice.js";
import { COMPANY_API_END_POINT } from "../utils/constant.js";
import { setUser } from "../redux/authslice.js";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user || user.role !== "recruiter" || !user.isProfileComplete) return;

    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          dispatch(setUser(null));
        } else {
          console.error("Error fetching companies:", error);
        }
      }
    };

    fetchCompanies();
  }, [dispatch, user]);
};

export default useGetAllCompanies;
