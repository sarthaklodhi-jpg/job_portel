import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobslice";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0 - 40k", "40k - 1 Lakh", "1 Lakh - 5 Lakh"],
  },
];

const FilterCard = () => {
  const  [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() =>{
    dispatch(setSearchedQuery(selectedValue));

  }, [selectedValue]);

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h1 className="text-xl font-bold mb-4">Filter Jobs</h1>
      <hr className="mb-4" />

      {/* Filter sections */}
      <div className="space-y-6">
        {filterData.map((data, index) => (
          <div key={index}>
            <h2 className="font-semibold text-lg mb-2 text-[#6A38C2]">
              {data.filterType}
            </h2>
            <RadioGroup value = {selectedValue} onValueChange={changeHandler} >
              {data.array.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 mb-2 cursor-pointer"
                >
                  <RadioGroupItem value={item} id={`${data.filterType}-${idx}`} />
                  <Label htmlFor={`${data.filterType}-${idx}`} className="text-gray-700">
                    {item}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
