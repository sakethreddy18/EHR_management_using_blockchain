import React, { useState } from "react";
import LandingPage_2 from "./LandingPage_2";

// Assuming you have images in a folder named `images` inside the `src` directory.
import lp_13 from "./lp_13.png";
import lp_12 from "./lp_12.png";

function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);
  function onEnter() {
    setIsHovered(true);
  }
  function onLeave() {
    setIsHovered(false);
  }

  return (
    <div>
      <div className="bg-gray-900 text-white font-sans min-h-screen flex items-center justify-center">
        <div
          className="w-[1400px] h-[450px] mt-[-180px] flex"
          onMouseEnter={() => setTimeout(onEnter, 150)}
          onMouseLeave={() => setTimeout(onLeave, 200)}
        >
          {/* Image */}
          <div className="flex-grow relative overflow-hidden transition-transform duration-10000 ease-in-out transform hover:scale-105">
            <img
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-10000 ease-in-out ${
                !isHovered ? "opacity-100" : "opacity-0"
              }`}
              src={lp_12}
              alt="Landing page illustration"
            />
            <img
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-10000 ease-in-out ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              src={lp_13}
              alt="Landing page illustration"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col text-custom-blue space-y-8 w-2/5 p-8 bg-gray-800 shadow-lg ml-4 rounded-lg transition-transform duration-10000 ease-in-out transform hover:scale-105">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold font-mono">
                Blockchain in Medical Field
              </h1>
              <p className="text-lg font-mono">
                Blockchain, with its decentralized and immutable nature, offers
                significant advantages in ensuring patient data privacy,
                streamlining operations, and fostering trust among stakeholders.
                It provides a transparent platform for securely storing medical
                records, ensuring only authorized individuals have access.
              </p>
            </div>
          </div>
        </div>
      </div>
      <LandingPage_2></LandingPage_2>
    </div>
  );
}

export default LandingPage;
