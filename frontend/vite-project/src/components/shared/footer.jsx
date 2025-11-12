import React from 'react'
import { Facebook, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-8">
        
        {/* Left Section */}
        <div>
          <h2 className="text-3xl font-extrabold text-[#6A38C2] tracking-tight">JobHunt</h2>
          <p className="text-sm text-gray-600 mt-2">
            © 2024 JobHunt. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Built with ❤️ by the JobHunt Team
          </p>
        </div>

        {/* Center Section (Links) */}
        <div className="flex flex-wrap justify-center md:justify-center gap-x-6 gap-y-3 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-[#6A38C2] hover:underline underline-offset-4 transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-[#6A38C2] hover:underline underline-offset-4 transition-colors">
            Jobs
          </a>
          <a href="#" className="hover:text-[#6A38C2] hover:underline underline-offset-4 transition-colors">
            Companies
          </a>
          <a href="#" className="hover:text-[#6A38C2] hover:underline underline-offset-4 transition-colors">
            About
          </a>
          <a href="#" className="hover:text-[#6A38C2] hover:underline underline-offset-4 transition-colors">
            Contact
          </a>
        </div>

        {/* Right Section (Social Icons) */}
        <div className="flex justify-center md:justify-end space-x-5">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#6A38C2] transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#6A38C2] transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#6A38C2] transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="mt-10 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
        Made with 💜 for job seekers everywhere.
      </div>
    </footer>
  )
}

export default Footer
