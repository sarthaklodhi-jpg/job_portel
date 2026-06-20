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

  }, [selectedValue, dispatch]);

  return (
    <div className="premium-card p-5">
      <h1 className="text-xl font-bold tracking-tight text-slate-950">Filter Jobs</h1>
      <p className="mt-1 text-sm text-slate-500">Refine your search results.</p>
      <hr className="my-5 border-slate-200" />

      {/* Filter sections */}
      <div className="space-y-6">
        {filterData.map((data, index) => (
          <div key={index}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              {data.filterType}
            </h2>
            <RadioGroup value = {selectedValue} onValueChange={changeHandler} >
              {data.array.map((item, idx) => (
                <div
                  key={idx}
                  className="mb-2 flex cursor-pointer items-center space-x-2 rounded-xl px-2 py-2 transition hover:bg-slate-50"
                >
                  <RadioGroupItem value={item} id={`${data.filterType}-${idx}`} />
                  <Label htmlFor={`${data.filterType}-${idx}`} className="cursor-pointer text-sm font-medium text-slate-700">
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
