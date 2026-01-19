import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const GoogleLoginButton = ({ role }) => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/google`,
        {
          token: credentialResponse.credential,
          role: input.role || null, // "student" or "recruiter"
        },
        {
          withCredentials: true, // 🔴 REQUIRED
        }
      );

      if (res.data.success) {
        toast.success("Logged in with Google");
        navigate("/"); // or dashboard
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
