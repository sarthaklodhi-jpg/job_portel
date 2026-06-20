import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
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
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_34%),linear-gradient(180deg,#020617_0%,#0f172a_58%,#111827_100%)]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-7">
          <motion.span
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="eyebrow mx-auto normal-case tracking-normal"
          >
            <Sparkles className="h-3.5 w-3.5" />
            No. 1 Job Hunt Platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl"
          >
            Search, Apply & <br />
            <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Get Your Dream Job
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mx-auto max-w-2xl text-base leading-7 text-slate-600 sm:text-lg"
          >
            Discover job openings tailored to your skills and goals. Find opportunities
            that match your ambition and apply with confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mx-auto flex w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_22px_60px_rgba(15,23,42,0.12)] focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-500/10"
          >
            <input
              type="text"
              placeholder="Search jobs, roles or companies..."
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400"
            />

            <Button onClick={searchJobHandler} className="h-12 rounded-xl px-6">
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
          {["Curated openings", "Verified recruiters", "Fast applications"].map((item) => (
            <div key={item} className="premium-panel px-4 py-3 text-sm font-semibold text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
