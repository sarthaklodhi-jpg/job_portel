import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSingleCompany } from "../redux/companyslice.js";
import { COMPANY_API_END_POINT } from "../utils/constant.js";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {

    const fetchSingleComapany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
          withCredentials: true,
        });

        console.log("API Response:", res.data); // 👈 add this for debugging

        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchSingleComapany();
  }, [companyId,dispatch]);
};

export default useGetCompanyById;
