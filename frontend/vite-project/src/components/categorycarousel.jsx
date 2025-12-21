import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "../redux/jobslice.js";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "Full Stack Developer",
  "DevOps Engineer",
  "UI/UX Designer",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <Carousel
          opts={{ align: "start", loop: true }}
          className="relative w-full"
        >
          <CarouselContent className="px-10">
            {categories.map((cat, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 flex justify-center"
              >
                <Button
                  onClick={() => searchJobHandler(cat)}
                  variant="outline"
                  className="rounded-full border-2 border-[#6A38C2] text-[#6A38C2]
                  hover:bg-[#6A38C2] hover:text-white transition-all duration-300
                  shadow-sm px-5 py-2 w-full max-w-[200px]"
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-50 rounded-full border" />
          <CarouselNext className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-50 rounded-full border" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
