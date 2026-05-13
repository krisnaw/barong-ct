import Image from "next/image";

export default async function Home() {
  return (
    <div className="flex-1 h-[95vh]">
      <div className="relative isolate overflow-hidden h-full">
        {/* Background Image */}

        <div>

          <Image
            alt=""
            src="/bg-image-opt.jpg"
            fill={true}
            className="absolute inset-0 -z-10 size-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Text Container */}
        {/* Added 'relative' and flex properties to center the text */}
        <div className="relative z-10 flex flex-col h-full items-center justify-center text-center">
          <h2 className={`text-white font-bold text-5xl md:text-7xl leading-relaxed`}>
            Barong Melali 2026
          </h2>
          <button
            type="button"
            className=" mt-4 bg-orange-600 px-3.5 py-2.5 text-sm lg:px-8.5 lg:py-4.5 lg:text-2xl font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
