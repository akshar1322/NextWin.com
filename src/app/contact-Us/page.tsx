"use client";

import Image from "next/image";
import { useState } from "react";
import countries from "@/lib/countries";
import Navbar from "@/app/components/Ui/Navbar";
import Footer from "@/app/components/Ui/Footer";

export default function ContactPage() {
  const [selectedLocation, setSelectedLocation] = useState(0);

  const locations = [
    {
      name: "Location 1",
      image: "/images/locations/valentin-dVUSUGotack-unsplash.jpg",
      city: "Ahmedabad, Gujarat",
      store: "Next Win",
      address: "123 Main St, Ahmedabad, Gujarat 380001",
      phone: "+91 92651-32874",
      hours: "Monday to Friday\n10:00am - 8:00pm",
    },
  ];

  return (
    <>
      <main className="bg-white text-black min-h-screen flex flex-col">
        {/* ✅ Navbar */}
        <header>
          <Navbar />
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-28 lg:py-32 space-y-14">
          {/* Heading */}
          <div className="text-center space-y-4 px-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
              Get in Touch
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              We love our customers. You can reach us at any time. <br />
              Contact us by email, or call.
            </p>
          </div>

          {/* Hero Banner */}
          <div className="w-full rounded-lg overflow-hidden">
            <Image
              src="/images/bg/Ethereal Motion (8).png"
              alt="Hero"
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Customer Service + Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 bg-gray-100 rounded-xl">
            {/* Left Info */}
            <div className="space-y-4 text-base sm:text-lg">
              <h3 className="text-xl sm:text-2xl font-semibold">
                Customer Service
              </h3>
              <p>Phone: 123-456-7890</p>
              <p>Email: info@mysite.com</p>
              <p>Hours: Monday-Friday 9:00am - 7:00pm EST</p>
              <p>
                For questions regarding our products and services you can also
                contact us by filling out the form below.
              </p>
            </div>

            {/* Right Form */}
            <div className="bg-black p-6 sm:p-8 rounded-xl text-white">
              <form
                action="https://api.web3forms.com/submit"
                method="POST"
                className="space-y-4"
              >
                <input
                  type="hidden"
                  name="access_key"
                  value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="firstName"
                    required
                    placeholder="First Name"
                    className="bg-white text-black border p-3 rounded-md w-full"
                  />
                  <input
                    name="lastName"
                    required
                    placeholder="Last Name"
                    className="bg-white text-black border p-3 rounded-md w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                    className="bg-white text-black border p-3 rounded-md w-full"
                  />
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      required
                      className="bg-white text-black border p-3 rounded-md w-1/3"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                    <input
                      name="phone"
                      required
                      placeholder="Phone Number"
                      className="bg-white text-black border p-3 rounded-md w-2/3"
                    />
                  </div>
                </div>

                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  className="bg-white text-black border p-3 rounded-md w-full h-32"
                />

                <button
                  type="submit"
                  className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-all w-full sm:w-auto"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          {/* Come Say Hi */}
          <div className="space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Come Say Hi
            </h2>

            <div className="flex flex-wrap gap-6 border-b border-gray-300">
              {locations.map((loc, i) => (
                <button
                  key={i}
                  className={`pb-2 transition-all duration-300 ${
                    selectedLocation === i
                      ? "border-b-2 border-black"
                      : "text-gray-500"
                  }`}
                  onClick={() => setSelectedLocation(i)}
                >
                  {loc.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              {/* Left Image */}
              <Image
                src={locations[selectedLocation].image}
                alt="Store"
                width={600}
                height={400}
                className="rounded-lg shadow-md w-full h-auto object-cover"
              />

              {/* Right Info */}
              <div className="text-base sm:text-lg leading-7 space-y-2">
                <p className="text-sm text-gray-500">
                  {locations[selectedLocation].city}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {locations[selectedLocation].store}
                </h3>
                <p>{locations[selectedLocation].address}</p>
                <p>{locations[selectedLocation].phone}</p>
                <p className="mt-2 whitespace-pre-line">
                  Opening Hours: {locations[selectedLocation].hours}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Footer */}
        <footer>
          <Footer />
        </footer>
      </main>
    </>
  );
}
