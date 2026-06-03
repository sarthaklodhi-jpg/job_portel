import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { User2, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "../../utils/constant.js";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../../redux/authslice.js";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logouthandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        setMobileOpen(false);
        navigate("/");
        toast.success("Logout Successful");
      }
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link to="/" className="flex items-center">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Job<span className="text-[#F83802]">Portal</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-[15px] font-semibold text-gray-700">
          <NavLinks user={user} />
        </nav>

        <div className="hidden md:flex items-center gap-4">
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
                      src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
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
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                      alt={user?.fullname || "User"}
                    />
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{user?.fullname}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-3" />

                <div className="flex flex-col gap-1 text-sm">
                  <Link
                    to={user.role === "recruiter" ? "/recruiter/profile" : "/profile"}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                  >
                    <User2 className="h-4 w-4" />
                    View Profile
                  </Link>

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

        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4">
          <nav className="flex flex-col gap-3 text-sm font-semibold text-gray-700">
            <NavLinks user={user} onNavigate={() => setMobileOpen(false)} />
          </nav>

          <div className="mt-4 border-t pt-4">
            {!user ? (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Signup</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">{user.fullname}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <Button variant="outline" onClick={logouthandler}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const NavLinks = ({ user, onNavigate }) =>
  user && user.role === "recruiter" ? (
    <>
      <NavItem to="/recruiter/dashboard" onNavigate={onNavigate}>Dashboard</NavItem>
      <NavItem to="/admin/companies" onNavigate={onNavigate}>Companies</NavItem>
      <NavItem to="/admin/jobs" onNavigate={onNavigate}>Jobs</NavItem>
    </>
  ) : (
    <>
      <NavItem to="/" onNavigate={onNavigate}>Home</NavItem>
      <NavItem to="/student/dashboard" onNavigate={onNavigate}>Dashboard</NavItem>
      <NavItem to="/jobs" onNavigate={onNavigate}>Jobs</NavItem>
      <NavItem to="/browse" onNavigate={onNavigate}>Browse</NavItem>
    </>
  );

const NavItem = ({ to, children, onNavigate }) => (
  <Link
    to={to}
    onClick={onNavigate}
    className="relative group transition-colors hover:text-[#F83802]"
  >
    {children}
    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#F83802] transition-all group-hover:w-full" />
  </Link>
);

export default Navbar;
