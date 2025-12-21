import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobslice.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f9f6ff] to-white">
      {/* Decorative blur */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#6A38C2]/20 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-24 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative text-center py-24 px-4"
      >
        <div className="flex flex-col gap-7 max-w-4xl mx-auto">
          
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto px-6 py-2 rounded-full bg-[#f1eaff] text-[#6A38C2] font-medium shadow-sm"
          >
            🚀 No. 1 Job Hunt Platform
          </motion.span>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
          >
            Search, Apply & <br />
            <span className="text-[#6A38C2]">
              Get Your Dream Job
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg"
          >
            Discover thousands of job openings tailored to your skills and
            goals. Find opportunities that truly match your passion.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex w-full sm:w-[80%] md:w-[60%] lg:w-[50%] mx-auto 
                       bg-white border border-gray-200 rounded-full shadow-lg 
                       overflow-hidden focus-within:ring-2 focus-within:ring-[#6A38C2]/50"
          >
            <input
              type="text"
              placeholder="Search jobs, roles or companies..."
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-6 py-4 outline-none text-gray-700 placeholder-gray-400"
            />

            <Button
              onClick={searchJobHandler}
              className="rounded-none rounded-r-full bg-[#6A38C2] 
                         hover:bg-[#5b2fb0] px-7 flex items-center justify-center"
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
