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
    <section className="w-full border-y border-slate-200/70 bg-white py-8">
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
                  className="w-full max-w-[210px] rounded-full border-slate-200 bg-white px-5 py-2 text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute -left-3 top-1/2 -translate-y-1/2 rounded-full border-slate-200 bg-white shadow-md hover:bg-slate-50" />
          <CarouselNext className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border-slate-200 bg-white shadow-md hover:bg-slate-50" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
