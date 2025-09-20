// data/products.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: "men" | "women" | "new";
  images: string[];
  sizes: string[];
  description: string;
  tag?: string;
  affiliates: {
    amazon?: string;
    flipkart?: string;
    myntra?: string;
  };
}

export const products: Product[] = [
  {
    id: 1,
    name: "Classic Men's T-Shirt",
    price: 19.99,
    stock: 50,
    category: "men",
    images: [
      "/images/prodcts/p3.jpg",
      "/images/prodcts/p3-.jpg",
      "/images/prodcts/p4.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A premium cotton t-shirt designed for all-day comfort with a modern fit.",
    tag: "Best Seller",
    affiliates: {
      amazon: "https://amazon.com/example-men1",
      flipkart: "https://flipkart.com/example-men1",
      myntra: "https://myntra.com/example-men1",
    },
  },
  {
    id: 2,
    name: "Elegant Women's Dress",
    price: 49.99,
    stock: 30,
    category: "women",
    images: [
      "/images/prodcts/p1.jpg",
      "/images/prodcts/p1-.jpg",
      "/images/prodcts/p3.jpg",
    ],
    sizes: ["S", "M", "L"],
    description: "Chic and elegant dress perfect for evening occasions.",
    tag: "New Arrival",
    affiliates: {
      amazon: "https://amazon.com/example-women1",
      flipkart: "https://flipkart.com/example-women1",
    },
  },
  {
    id: 3,
    name: "Trendy Sneakers",
    price: 59.99,
    stock: 20,
    category: "new",
    images: [
      "/images/prodcts/p2.jpg",
      "/images/prodcts/p2-.jpg",
      "/images/prodcts/p1.jpg",
    ],
    sizes: ["7", "8", "9", "10"],
    description:
      "Comfortable sneakers designed for everyday wear and street style.",
    affiliates: {
      amazon: "https://amazon.com/example-new1",
      myntra: "https://myntra.com/example-new1",
      flipkart: "https://flipkart.com/example-men1",
    },
  },
];
