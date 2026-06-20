import React from "react";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto max-w-7xl px-6 py-14"
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Job<span className="text-sky-400">Portal</span>
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">
              A modern job portal connecting talent with the right opportunities.
              Built for speed, clarity, and growth.
            </p>
            <p className="mt-4 text-xs text-slate-500">
              © 2026 JobPortal. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col md:items-center">
            <h3 className="mb-4 text-sm font-semibold text-white">Explore</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-300">
              {["Home", "Jobs", "Companies", "About", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-sky-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col md:items-end">
            <h3 className="mb-4 text-sm font-semibold text-white">Connect</h3>
            <div className="flex items-center gap-4">
              <SocialLink href="https://facebook.com" label="Facebook">
                <Facebook className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="https://twitter.com" label="Twitter">
                <Twitter className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="https://linkedin.com" label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        Made for job seekers and hiring teams.
      </div>
    </footer>
  );
};

const SocialLink = ({ href, label, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-sky-300 hover:text-sky-300"
  >
    {children}
  </a>
);

export default Footer;
