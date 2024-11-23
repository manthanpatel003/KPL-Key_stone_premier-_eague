"use client";
import axios from "axios";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";

const poppins = Poppins({
  weight: ["400", "700"], // Specify weights if needed
  subsets: ["latin"], // Specify subsets
});

export default function Home() {
  const [player, setPlayer] = useState(null);
  const fetchPlayer = async () => {
    try {
      const response = await axios.get("/api/players");
      setPlayer(response.data);
    } catch (error) {
      console.error("Error fetching player:", error.response?.data || error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      fetchPlayer();
    }, 2000);
  }, []);

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
        className={`flex items-center justify-center min-h-screen  ${poppins.className}`}
      >
        {" "}
        <Image
          className="absolute bottom-3"
          src={"/kpl_logo.png"}
          width={300}
          height={300}
        />
        <h1 className="bg-blue-950 text-9xl font-extrabold text-yellow-500 p-12 rounded-xl shadow-[rgba(0,_0,_0,_0.4)_30px_30px_40px_-2px] border-1 border-2 border-yellow-500">
          All Players Sold
        </h1>
      </main>
    );
  }
  return (
    <main>
      <Image
        className="absolute bottom-3"
        src={"/kpl_logo.png"}
        width={300}
        height={300}
      />

      <div className="absolute bottom-52 left-1/2 transform -translate-x-1/2 h-[50vh] w-[1000px] bg-blue-950 rounded-lg flex gap-5 p-10  ">
        <div className="flex-[2] relative">
          <Image
            className="h-full w-full max-h-full max-w-[300px] object-cover rounded-lg border-4 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]"
            src={player?.player?.image}
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
            <h2 className="text-6xl text-center text-white ">
              {player?.player?.name ?? "---"}
            </h2>
            <h5 className="mt-2 text-2xl text-center text-white">
              {player?.player?.type ?? "---"}
            </h5>
          </div>
          <div className="text-3xl">
            <div className="border-b-2 flex items-center gap-3 py-3">
              <h3 className="text-yellow-400">CATEGORY :</h3>
              <h3 className="text-white">
                {player?.player?.category ?? "---"}
              </h3>
            </div>
            <div className="border-b-2 flex items-center gap-3 py-3">
              <h3 className="text-yellow-400">BASE PRICE :</h3>
              <h3 className="text-white">
                {player?.player?.basePrice ?? "---"}
              </h3>
            </div>
            <div className="border-b-2 flex items-center gap-3 py-3">
              <h3 className="text-yellow-400">CURRENT PRICE:</h3>
              <h3 className="text-white">
                {player?.player?.currentPrice ?? "---"}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
