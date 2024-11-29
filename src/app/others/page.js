"use client";
import axios from "axios";
import { useEffect, useState } from "react";

function page() {
  const [players, setPlayers] = useState([]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get("/api/others");
      console.log({ response });
      setPlayers(response.data?.players);
    } catch (error) {
      console.error("Error fetching players:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);
  return (
    <main className="p-8 max-h-screen overflow-auto">
      <div className="mt-[300px] flex gap-3 max-w-full">
        {players &&
          Array.isArray(players) &&
          players.length > 0 &&
          players.map((player) => {
            return (
              <div class="min-w-[300px] max-w-[300px] p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <img
                  class="w-full"
                  src={player?.image}
                  alt={player?.name}
                  onError={(e) => {
                    e.target.src = "/players-image/no_user.jpg";
                  }}
                />

                <div class="p-5">
                  <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Name: {player?.name}
                  </h5>
                  <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Base Price :{" "}
                    {player?.basePrice ? player?.basePrice + "/-" : "---"}
                  </h5>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}

export default page;
