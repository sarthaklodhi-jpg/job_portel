import React from 'react'
import { Badge } from '@/components/ui/badge'

const LatestJobCards = ({job}) => {
  return (
    <div className="w-full h-full p-6 rounded-2xl shadow-md hover:shadow-xl bg-white border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      {/* Company Info */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-semibold text-lg text-gray-800">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">San Francisco, USA</p>
        </div>
        <Badge className="bg-[#6A38C2] text-white font-medium px-3 py-1 shadow-sm">
          Hiring
        </Badge>
      </div>

      {/* Job Info */}
      <div className="mt-5">
        <h2 className="font-bold text-xl text-gray-900 leading-snug">
          {job?.title}
        </h2>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {job?.description?.slice(0, 100)}...
        </p>
      </div>

      {/* Tags / Badges */}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <Badge
          variant="outline"
          className="text-blue-700 font-semibold border-blue-200 bg-blue-50 hover:bg-blue-100"
        >
          {job?.position}
        </Badge>
        <Badge
          variant="outline"
          className="text-[#F83082] font-semibold border-pink-200 bg-pink-50 hover:bg-pink-100"
        >
        {job?.jobType}
        </Badge>
        <Badge
          variant="outline"
          className="text-[#7209b7] font-semibold border-purple-200 bg-purple-50 hover:bg-purple-100"
        >
          {job?.salary}
        </Badge>
      </div>
    </div>
  )
}

export default LatestJobCards
