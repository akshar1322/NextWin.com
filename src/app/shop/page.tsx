import ProductCard from "@/components/cards/ProductCard";
import { Product } from "@/types/product";
import Navbar from "../../components/Ui/Navbar/Navbar";
import Footer from "../../components/Ui/Footer";
import BannerSlider from "@/components/Elements/sliders/propBannerSlider";

const menSlides = [
  { id: 1, image: "/images/banners/1600w-IM0sQ6hr9Kc (1).jpg", link: "#" },
  { id: 2, image: "/images/banners/emma-swoboda-qKaioqt8mo4-unsplash.jpg", link: "#" },
];

export default async function ShopPage({ searchParams }: { searchParams: { category?: string; search?: string } }) {
  const category = searchParams.category || "";
  const search = searchParams.search || "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/products?${category ? `category=${category}&` : ""}${search ? `search=${search}` : ""}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  if (!data.success) {
    return <p className="text-center text-red-500">Failed to load products</p>;
  }

  const products: Product[] = data.products;

  return (
    <>
      <main className='bg-[#EEEEEE] overflow-hidden'>
        <Navbar/>
        <div className='mt-6 sm:mt-14 lg:mt-16'>
          <BannerSlider slides={menSlides} />
        </div>

        <section className="w-full px-8 bg-[#EEEEEE] text-black py-16">
          <h2 className="text-5xl font-bold mt-10 mb-10">Shop</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => <ProductCard key={product._id} product={product} />)
            ) : (
              <p className="col-span-full text-center text-gray-500">No products found.</p>
            )}
          </div>
        </section>
        <Footer/>
      </main>
    </>
  );
}
