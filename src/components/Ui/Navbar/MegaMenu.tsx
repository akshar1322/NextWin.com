import Image from "next/image";

type MegaMenuProps = {
  category: string;
};

export default function MegaMenu({ category }: MegaMenuProps) {
  const menus: Record<
    string,
    { title: string; items: string[]; image: string }
  > = {
    readyToWear: {
      title: "Ready to Wear",
      items: [
        "New Arrivals",
        "Hoodies",
        "Shirts",
        "Shackets",
        "Tailoring",
        "Knitwear",
      ],
      image: "/images/Nav_Img/2_20251102_212827_0001.png",
    },
    Tops: {
      title: "Tops",
      items: ["Women's Collection", "Sweatshirts", "Bottoms","T-Shirts",],
      image: "/images/Nav_Img/8_20251102_183856_0007.png",
    },
    newIn: {
      title: "New In",
      items: ["Latest Arrivals", "Trending Now", "Limited Edition","New Arrivals",],
      image: "/images/Nav_Img/2_20251102_183856_0001.png",
    },
  };

  const data = menus[category];

  if (!data) return null;

  return (
    <div className="w-full bg-white capitalize text-black">
      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
          sm:gap-8
          px-6
          sm:px-10
          py-8
          capitalize
        "
      >
        {/* --- LEFT: Links --- */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {data.items.map((item) => (
            <a
              key={item}
              href="#"
              className="
                text-gray-800
                hover:text-black
                text-sm sm:text-base
                transition-colors
                border-b border-transparent
                hover:border-black
                pb-1
                capitalize
              "
            >
              {item}
            </a>
          ))}
        </div>

        {/* --- RIGHT: Image --- */}
        <div className="relative w-full h-40 sm:h-48 lg:h-56 rounded-xl overflow-hidden">
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-2 left-2 capitalize bg-white/90 px-3 py-1 text-xs sm:text-sm font-semibold rounded">
            {data.title}
          </div>
        </div>
      </div>
    </div>
  );
}
