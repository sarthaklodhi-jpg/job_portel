import React from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

const HeroSection = () => {
  return (
    <section className="text-center py-20 px-4 bg-gradient-to-b from-white via-[#f9f6ff] to-white">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Tagline */}
        <span className="mx-auto px-6 py-2 rounded-full bg-[#f1eaff] text-[#6A38C2] font-medium shadow-sm">
          🚀 No. 1 Job Hunt Platform
        </span>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          Search, Apply &<br />
          <span className="text-[#6A38C2]">Get Your Dream Job</span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">
          Discover thousands of job openings tailored to your skills and goals. Find opportunities that truly match your passion.
        </p>

        {/* Search Bar */}
        <div className="flex w-full sm:w-[80%] md:w-[60%] lg:w-[50%] mx-auto shadow-md border border-gray-200 rounded-full overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200">
          <input
            type="text"
            placeholder="Search jobs, roles or companies..."
            className="flex-1 px-5 py-3 outline-none text-gray-700"
          />
          <Button className="rounded-none rounded-r-full bg-[#6A38C2] hover:bg-[#5b2fb0] text-white px-6 py-3 flex items-center justify-center">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
