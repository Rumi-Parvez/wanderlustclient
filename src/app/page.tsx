import { Hero } from "@/components/Hero";
import { FeaturedDestinations } from "@/components/FeaturedDestinations";
import { Whychoose } from "@/components/Whychoose";
import { Travelarreiew } from "@/components/Travelarreiew";
import { Startjurny } from "@/components/Startjurny";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <Whychoose />
      <Travelarreiew />
      <Startjurny />
    </>
  );
}
