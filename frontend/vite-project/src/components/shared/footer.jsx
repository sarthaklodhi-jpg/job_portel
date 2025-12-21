import React from "react";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 py-14"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#6A38C2]">
              JobHunt
            </h2>
            <p className="text-sm text-gray-600 mt-3 max-w-xs">
              A modern job portal connecting talent with the right opportunities.
              Built for speed, clarity, and growth.
            </p>
            <p className="text-xs text-gray-400 mt-4">
              © 2024 JobHunt. All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col md:items-center">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Explore
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-600">
              {["Home", "Jobs", "Companies", "About", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-[#6A38C2] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col md:items-end">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Connect
            </h3>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#6A38C2] hover:border-[#6A38C2] transition"
              >
                <Facebook className="h-4 w-4" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#6A38C2] hover:border-[#6A38C2] transition"
              >
                <Twitter className="h-4 w-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#6A38C2] hover:border-[#6A38C2] transition"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        Made with 💜 for job seekers everywhere.
      </div>
    </footer>
  );
};

export default Footer;
