import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { User2, LogOut, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { USER_API_END_POINT } from "../../utils/constant.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/authslice.js";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logouthandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success("Logout Successful");
      }
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full h-24 flex items-center justify-between px-6 lg:px-8"
      >
        {/* LEFT — LOGO */}
        <Link to="/" className="flex items-center">
          <span className="text-3xl font-extrabold tracking-tight text-gray-900">
            Job<span className="text-[#F83802]">Portal</span>
          </span>
        </Link>

        {/* CENTER — NAVIGATION */}
        <nav className="hidden md:flex items-center gap-12 text-[15px] font-semibold text-gray-700">
          {user && user.role === "recruiter" ? (
            <>
              <NavItem to="/admin/companies">Companies</NavItem>
              <NavItem to="/admin/jobs">Jobs</NavItem>
            </>
          ) : (
            <>
              <NavItem to="/">Home</NavItem>
              <NavItem to="/jobs">Jobs</NavItem>
              <NavItem to="/browse">Browse</NavItem>
            </>
          )}
        </nav>

        {/* RIGHT — AUTH / PROFILE */}
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg">Signup</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  className="flex items-center gap-3 rounded-full px-3 py-2 hover:bg-gray-100 transition"
                >
                  <Avatar className="h-11 w-11 ring-2 ring-transparent hover:ring-[#F83802]/40 transition">
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto ||
                        "https://github.com/shadcn.png"
                      }
                      alt={user?.fullname || "User"}
                    />
                  </Avatar>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </motion.button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-72 rounded-2xl border border-gray-200 shadow-xl p-4"
              >
                {/* USER INFO */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto ||
                        "https://github.com/shadcn.png"
                      }
                      alt={user?.fullname || "User"}
                    />
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user?.fullname}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.profile?.bio || "No bio available"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-3" />

                {/* ACTIONS */}
                <div className="flex flex-col gap-1 text-sm">
                  {user.role === "student" && (
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                    >
                      <User2 className="h-4 w-4" />
                      View Profile
                    </Link>
                  )}

                  <button
                    onClick={logouthandler}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </motion.div>
    </header>
  );
};

/* 🔹 Animated Navigation Link */
const NavItem = ({ to, children }) => (
  <Link
    to={to}
    className="relative group transition-colors hover:text-[#F83802]"
  >
    {children}
    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#F83802] transition-all group-hover:w-full" />
  </Link>
);

export default Navbar;
