import Image from "next/image";

const features = [
  {
    icon: "/images/ShieldCheck.png",
    title: "Safe & Secure",
    desc: "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/images/MapTrifold.png",
    title: "Expert Guides",
    desc: "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/images/Headset.png",
    title: "24/7 Support",
    desc: "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

export function Whychoose() {
  return (
    <section className="px-6 bg-[#ebf6fa] py-16 md:px-10">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-serif text-3xl text-gray-900 md:text-4xl">
          Why Choose Wanderlust
        </h2>
        <p className="mt-2 text-xs text-gray-500">
          Your trusted partner for exceptional travel experiences
        </p>

        <div className="mt-12 grid gap-6 text-left md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-md p-6 shadow-sm"
            >
              <div className="bg-[#fbfeff] grid size-11 place-items-center rounded-lg border border-cyan-100 shadow-sm">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={24}
                  height={24}
                  className="size-6"
                />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-gray-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
