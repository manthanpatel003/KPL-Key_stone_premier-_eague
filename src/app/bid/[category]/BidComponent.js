"use client";
import axios from "axios";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { categoryOrder } from "../../../lib/helper";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function BidComponent({ category }) {
  const [player, setPlayer] = useState(null);
  const intervalRef = useRef(null);

  if (!category) return <>Loading...</>;

  const fetchPlayer = async () => {
    try {
      const response = await axios.get(
        "/api/players/" + String(category).toLowerCase()
      );
      setPlayer(response.data);
    } catch (error) {
      console.error("Error fetching player:", error.response?.data || error);
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      clearInterval(intervalRef.current); // Stop API calls when the page is hidden
    } else {
      intervalRef.current = setInterval(fetchPlayer, 1000); // Resume API calls when the page becomes visible
    }
  };

  useEffect(() => {
    // Set up interval initially
    intervalRef.current = setInterval(fetchPlayer, 1000);

    // Add event listener for page visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  useEffect(() => {
    if (player !== null && player?.success && !player?.player) {
      // Stop the interval
      clearInterval(intervalRef.current);
    }
  }, [player]);

  const [isWeb, setIsWeb] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsWeb(window.innerWidth >= 900);
    };

    // Set the initial value
    handleResize();

    // Add event listener on mount
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isWeb) {
    return <h1 className="text-7xl ">Oops!🙇🏻 Site is only for web.</h1>;
  }

  if (player !== null && player?.success && !player?.player) {
    return (
      <main
        className={` flex items-center justify-center min-h-screen  ${poppins.className}`}
      >
        <Confetti width={window.innerWidth} height={window.innerHeight} />{" "}
        <Image
          className="absolute bottom-3"
          src={"/kpl_logo.png"}
          width={300}
          height={300}
        />
        <h1 className="bg-blue-950 text-9xl font-extrabold text-yellow-500 p-12 rounded-xl shadow-[rgba(0,_0,_0,_0.4)_50px_50px_40px_-2px] border-1 border-2 border-yellow-500 relative">
          All Players{category && `(${category})`} Sold
          <div className="absolute right-4 bottom-2 text-sm text-nowrap">
            {categoryOrder[category] && (
              <Link
                href={`/bid/${String(categoryOrder[category]).toLowerCase()}`}
              >
                Move to Next Category ({categoryOrder[category]})
              </Link>
            )}
          </div>
        </h1>
      </main>
    );
  }

  return (
    <main>
      <Image
        className="absolute bottom-3 left-0"
        src={"/kpl_logo.png"}
        width={250}
        height={250}
      />
      {player && (
        <>
          <Bars />

          <div className="shadow-[rgba(0,_0,_0,_0.5)_0px_0px_70px_2px] border-4 border-yellow-500 z-50 absolute top-[calc(50%+50px)] left-1/2 transform -translate-x-1/2 -translate-y-1/2   w-[1000px] bg-blue-950 rounded-lg flex gap-5 p-10  ">
            <div className="flex-[2] relative">
              <Image
                className="h-full w-full max-h-full max-w-[300px] object-cover rounded-lg border-4 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]"
                src={player?.player?.image ?? "/players-image/no_user.jpg"}
                width={350}
                height={500}
              />
              {player?.player?.isSold ? (
                <Image
                  className="absolute  bottom-0 left-0 tran transform"
                  src={"/sold-out.png"}
                  width={320}
                  height={320}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="flex-[3] flex flex-col justify-between ">
              <div>
                <h2 className="text-5xl text-center text-white mb-1 ">
                  {player?.player?.name ?? "---"}
                </h2>
                <hr />
                <h5 className="mt-2 text-2xl text-center text-white">
                  {player?.player?.type ?? "---"}
                </h5>
              </div>
              <div className="text-2xl">
                <div className="border-b-2 flex items-center gap-3 py-2">
                  <h3 className="text-yellow-400">BATTING STYLE :</h3>
                  <h3 className="text-white">
                    {player?.player?.battingStyle ?? "---"}
                  </h3>
                </div>
                <div className="border-b-2 flex items-center gap-3 py-2">
                  <h3 className="text-yellow-400">BOWLING STYLE :</h3>
                  <h3 className="text-white">
                    {player?.player?.bowlingStyle ?? "---"}
                  </h3>
                </div>
                <div className="border-b-2 flex items-center gap-3 py-2">
                  <h3 className="text-yellow-400">CATEGORY :</h3>
                  <h3 className="text-white">
                    {player?.player?.category ?? "---"}
                  </h3>
                </div>
                <div className="border-b-2 flex items-center gap-3 py-2">
                  <h3 className="text-yellow-400">BASE PRICE :</h3>
                  <h3 className="text-white">
                    {player?.player?.basePrice
                      ? player?.player?.basePrice + "/-"
                      : "---"}
                  </h3>
                </div>
                <div className="border-b-2 flex items-center gap-3 py-2">
                  <h3 className="text-yellow-400">CURRENT PRICE:</h3>
                  <h3 className="text-white">
                    {player?.player?.currentPrice
                      ? player?.player?.currentPrice + "/-"
                      : "---"}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <Bars position="right" />
        </>
      )}
    </main>
  );
}
const Bars = ({ position = "left" }) => {
  const [colors, setColors] = useState([
    "yellow", // 1st bar
    "orange", // 2nd bar
    "yellow", // 3rd bar
    "orange", // 4th bar
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColors((prevColors) =>
        prevColors.map((color) => (color === "yellow" ? "orange" : "yellow"))
      );
    }, 1000); // Change color every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Determine the position class based on the `position` prop

  return (
    <>
      <div
        className={`absolute bottom-[calc(50%-50px)] transform translate-y-1/2 ${
          position === "left" ? "-left-[2%]" : "-right-[2%]"
        } h-[10vh] w-16 rounded-md ${
          colors[0] === "yellow"
            ? "bg-yellow-400 shadow-[0_0_15px_5px_rgba(252,211,77,0.6)]"
            : "bg-orange-400 shadow-[0_0_15px_5px_rgba(251,146,60,0.6)]"
        }`}
      />
      <div
        className={`absolute bottom-[calc(50%-50px)] transform translate-y-1/2 ${
          position === "left" ? "left-[4%]" : "right-[4%]"
        } h-[20vh] w-16 rounded-md ${
          colors[1] === "yellow"
            ? "bg-yellow-400 shadow-[0_0_15px_5px_rgba(252,211,77,0.6)]"
            : "bg-orange-400 shadow-[0_0_15px_5px_rgba(251,146,60,0.6)]"
        }`}
      />
      <div
        className={`absolute bottom-[calc(50%-50px)] transform translate-y-1/2 ${
          position === "left" ? "left-[10%]" : "right-[10%]"
        } h-[30vh] w-16 rounded-md ${
          colors[2] === "yellow"
            ? "bg-yellow-400 shadow-[0_0_15px_5px_rgba(252,211,77,0.6)]"
            : "bg-orange-400 shadow-[0_0_15px_5px_rgba(251,146,60,0.6)]"
        }`}
      />
      <div
        className={`absolute bottom-[calc(50%-50px)] transform translate-y-1/2 ${
          position === "left" ? "left-[16%]" : "right-[16%]"
        } h-[40vh] w-16 rounded-md ${
          colors[3] === "yellow"
            ? "bg-yellow-400 shadow-[0_0_15px_5px_rgba(252,211,77,0.6)]"
            : "bg-orange-400 shadow-[0_0_15px_5px_rgba(251,146,60,0.6)]"
        }`}
      />
    </>
  );
};
