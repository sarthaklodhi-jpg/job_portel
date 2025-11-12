import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Job = ({ job}) => {
  const navigate =  useNavigate();

  const daysagofunction = (mongodbTime)=>{
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysAgo;
  }
  return (
    <div className="p-5 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
      {/* Top Row */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <p>{daysagofunction(job?.createdAt) == 0 ? "Today" : daysagofunction(job?.createdAt)} days ago</p>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 my-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2233276213.jpg" />
        </Avatar>
        <div>
          <h1 className="font-semibold text-sm">{job?.company?.name}</h1>
          <p className="text-xs text-gray-500">India</p>
        </div>
      </div>

      {/* Job Title + Description */}
      <div>
        <h1 className="font-bold text-base mb-1">{job?.title}</h1>
        <p className="text-gray-600 text-sm line-clamp-2">
          {job?.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Badge variant="outline" className="text-blue-700 font-semibold border-blue-200">
          {job?.position}
        </Badge>
        <Badge variant="outline" className="text-[#F83002] font-semibold border-[#FDDAD4]">
          {job?.jobType}
        </Badge>
        <Badge variant="outline" className="text-[#7209b7] font-semibold border-[#e9d5ff]">
          {job?.salary}
        </Badge>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 mt-5">
        <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" className="text-sm">
          Details
        </Button>
        <Button className="bg-[#7209b7] hover:bg-[#5c0991] text-white text-sm">
          Save For Later
        </Button>
      </div>
    </div>
  );
};

export default Job;
