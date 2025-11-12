import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'

const categories = [
  'Frontend Developer',
  'Backend Developer',
  'Data Science',
  'Graphic Designer',
  'Full Stack Developer',
  'DevOps Engineer',
  'UI/UX Designer',
]

const CategoryCarousel = () => {
  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="relative w-full"
        >
          {/* Add padding so arrows don't overlap items */}
          <CarouselContent className="px-10">
            {categories.map((cat, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 flex justify-center"
              >
                <Button
                  variant="outline"
                  className="rounded-full border-2 border-[#6A38C2] text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white transition-all duration-300 shadow-sm px-5 py-2 w-full max-w-[200px]"
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Make arrows float slightly outside carousel */}
          <CarouselPrevious className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-50 rounded-full border border-gray-200" />
          <CarouselNext className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-50 rounded-full border border-gray-200" />
        </Carousel>
      </div>
    </section>
  )
}

export default CategoryCarousel
