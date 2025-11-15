import ProductCard from "@/components/cards/ProductCard";
import { Product } from "@/types/product";
import Navbar from "../../components/Ui/Navbar/Navbar";
import Footer from "../../components/Ui/Footer";
import BannerSlider from "@/components/Elements/sliders/propBannerSlider";
import { getBaseUrl } from "@/lib/getBaseUrl";




export default async function ShopPage({ searchParams }: { searchParams: { category?: string; search?: string } }) {
  const category = searchParams.category || "";
  const search = searchParams.search || "";

  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (search) query.set("search", search);

  const requestUrl = new URL("/api/client/products", getBaseUrl());
  if (query.toString()) {
    requestUrl.search = query.toString();
  }

  let data: { success: boolean; products: Product[] } | null = null;

  try {
    const res = await fetch(requestUrl.toString(), { cache: "no-store" });

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status, res.statusText);
      return <p className="text-center text-red-500">Failed to load products</p>;
    }

    data = await res.json();
  } catch (error) {
    console.error("Unexpected error while fetching products:", error);
    return <p className="text-center text-red-500">Failed to load products</p>;
  }

  if (!data?.success) {
    return <p className="text-center text-red-500">Failed to load products</p>;
  }

  const products: Product[] = data.products;

  return (
    <>
      <main className='bg-[#EEEEEE] overflow-hidden'>
        <Navbar/>
        <div className='mt-6 sm:mt-14 lg:mt-16'>
          <BannerSlider
            height="lg:h-[70vh]"
            tag="featured"
            limit={4}
          />
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
