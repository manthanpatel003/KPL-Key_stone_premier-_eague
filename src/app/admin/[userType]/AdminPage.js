"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminPage({ playerType }) {
  const [player, setPlayer] = useState(null); // Store player details
  const [selectedTeam, setSelectedTeam] = useState(""); // Track selected team
  const [count, setCount] = useState(1);
  console.log(count);

  if (!playerType) return <>Loading...</>;

  // Fetch a player with no teamName on component load
  const fetchPlayer = async () => {
    try {
      const response = await axios.get("/api/players/" + playerType);
      console.log({ response });
      setPlayer(response.data?.player);
      setCount(1);
    } catch (error) {
      console.error("Error fetching player:", error.response?.data || error);
    }
  };
  useEffect(() => {
    fetchPlayer();
  }, []);

  // Handle increasing bid price
  const handleIncreaseBid = async () => {
    if (!player) return;
    let incCount = count <= 9 ? 100000 : 2500000;
    toast(count, incCount);
    const newPrice = player.currentPrice + incCount; // Example bid increment
    try {
      const response = await axios.put("/api/price-update", {
        playerId: player._id,
        newPrice,
      });
      setPlayer(response.data.player);
      setCount((prev) => prev + 1);
    } catch (error) {
      console.error(
        "Error increasing bid price:",
        error.response?.data || error
      );
    }
  };

  // Handle marking player as sold
  const handleMarkSold = async () => {
    if (!player) return;
    try {
      const response = await axios.put("/api/players", {
        playerId: player._id,
      });
      setPlayer(response.data.player);
    } catch (error) {
      console.error(
        "Error marking player as sold:",
        error.response?.data || error
      );
    }
  };

  // Handle setting team
  const handleSetTeam = async () => {
    if (!player || !selectedTeam) return;
    try {
      const response = await axios.patch("/api/players", {
        playerId: player._id,
        teamName: selectedTeam,
      });
      setPlayer(response.data.player);
      fetchPlayer();
    } catch (error) {
      console.error("Error setting team:", error.response?.data || error);
    }
  };
  console.log(player);

  return (
    <div className="container mx-auto p-9">
      <div className=" w-full flex flex-col items-center gap-14">
        <div className="min-h-[450px] max-w-[100%] md:max-w-[1000px] bg-blue-950 rounded-lg flex flex-col md:flex-row gap-3 md:gap-5 p-5 md:p-10">
          <div className="flex-[2] relative">
            <Image
              className="h-full w-full max-h-full max-w-[100%] md:max-w-[300px] object-cover rounded-lg border-4 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]"
              src={player?.image}
              width={350}
              height={500}
            />
            {player?.isSold ? (
              <Image
                className="absolute bottom-0 left-0 transform"
                src={"/sold-out.png"}
                width={320}
                height={320}
              />
            ) : null}
          </div>
          <div className="flex-[3] flex flex-col justify-between">
            <div>
              <h2 className="text-4xl md:text-6xl text-center md:text-left text-white">
                {player?.name ?? "---"}
              </h2>
              <h5 className="mt-2 text-xl md:text-2xl text-center md:text-left text-white">
                {player?.type ?? "---"}
              </h5>
            </div>
            <div className="text-xl md:text-3xl">
              <div className="border-b-2 flex items-center gap-3 py-3">
                <h3 className="text-yellow-400">CATEGORY :</h3>
                <h3 className="text-white">{player?.category ?? "---"}</h3>
              </div>
              <div className="border-b-2 flex items-center gap-3 py-3">
                <h3 className="text-yellow-400">BASE PRICE :</h3>
                <h3 className="text-white">{player?.basePrice ?? "---"}</h3>
              </div>
              <div className="border-b-2 flex items-center gap-3 py-3">
                <h3 className="text-yellow-400">CURRENT PRICE:</h3>
                <h3 className="text-white">{player?.currentPrice ?? "---"}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div>
          <button
            onClick={handleIncreaseBid}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          >
            + Increase Bid
          </button>
          <button
            onClick={handleMarkSold}
            type="button"
            className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          >
            Sold Out
          </button>

          {/* Select Team */}
          <form className="max-w-sm mx-auto">
            <label
              htmlFor="team"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Team
            </label>
            <select
              id="team"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="" disabled>
                Choose a team
              </option>
              <option value="CSK">CSK</option>
              <option value="MI">MI</option>
              <option value="GT">GT</option>
              <option value="RCB">RCB</option>
            </select>
          </form>
          <button
            onClick={handleSetTeam}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full mt-2"
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
}
