import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authslice";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/google`,
        {
          token: credentialResponse.credential,
        },
        {
          withCredentials: true, // 🔴 REQUIRED
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Logged in with Google");
        navigate(res.data.isProfileComplete ? "/" : "/complete-profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => toast.error("Google Login Failed")}
    />
  );
};

export default GoogleLoginButton;
