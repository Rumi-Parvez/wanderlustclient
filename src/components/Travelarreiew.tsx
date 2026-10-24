"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

const testimonials = [
  {
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfect, The Resorts Were Luxurious, And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    photo: "/images/person2.png",
  },
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Stunning, And Our Guide Was Incredibly Knowledgeable. Highly Recommended!",
    name: "Sarah Johnson",
    location: "New York, USA",
    photo: "/images/person1.png",
  },
  {
    quote:
      "Japan Cherry Blossom Tour Was A Dream Come True. The Team Handled Everything From Flights To Hotels. Will Definitely Book Again!",
    name: "Amara Patel",
    location: "London, UK",
    photo: "/images/person3.jpg",
  },
  {
    quote:
      "Greece Island Hopping Was Pure Paradise. Every Hotel And Ferry Was Perfectly Arranged. The Best Trip We've Ever Taken!",
    name: "James Rodriguez",
    location: "Sydney, Australia",
    photo: "/images/person4.jpg",
  },
];

export function Travelarreiew() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section className="px-6 bg-white py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl text-gray-900 md:text-4xl">
              What Travelers Say
            </h2>
            <p className="mt-2 text-xs text-gray-500">
              Real experiences from our happy travelers
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 pt-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => emblaApi?.scrollPrev()}
              className="grid size-9 place-items-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-brand hover:text-brand"
            >
              <LuArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => emblaApi?.scrollNext()}
              className="grid size-9 place-items-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-brand hover:text-brand"
            >
              <LuArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <div className="-ml-5 flex">
            {testimonials.map((item) => (
              <div
                key={`${item.name}-${item.location}`}
                className="min-w-0 shrink-0 basis-full pl-5 md:basis-1/2"
              >
                <figure className="flex h-full min-h-[260px] border border-gray-200 bg-white">
                  <figcaption className="flex flex-1 flex-col justify-between gap-8 p-6">
                    <blockquote className="text-[15px] font-semibold leading-snug text-gray-900">
                      {item.quote}
                    </blockquote>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        — {item.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {item.location}
                      </p>
                    </div>
                  </figcaption>
                  <div className="relative hidden w-40 shrink-0 sm:block md:w-44">
                    <Image
                      src={item.photo}
                      alt={item.name}
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  </div>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
