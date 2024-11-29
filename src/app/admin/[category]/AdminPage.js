'use client';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { categoryOrder } from '../../../lib/helper';

export default function AdminPage({ category }) {
  const [player, setPlayer] = useState(null); // Store player details
  const [selectedTeam, setSelectedTeam] = useState(''); // Track selected team
  const [count, setCount] = useState({ '5Lac': 0, '20Lac': 0, '25Lac': 0 });
  console.log(count);

  if (!category) return <>Loading...</>;

  // Fetch a player with no teamName on component load
  const fetchPlayer = async () => {
    try {
      const response = await axios.get(
        '/api/players/' + String(category).toLowerCase(),
      );
      console.log({ response });
      setPlayer(response.data?.player);
      setCount({ '5Lac': 0, '20Lac': 0, '25Lac': 0 });
      setSelectedTeam('');
    } catch (error) {
      console.error('Error fetching player:', error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchPlayer();
  }, []);

  // Handle increasing bid price
  const handleIncreaseBid = async incCount => {
    if (!player) return;
    const newPrice = player.currentPrice + incCount * 100000; // Example bid increment
    try {
      const response = await axios.put('/api/price-update', {
        playerId: player._id,
        newPrice,
      });
      setPlayer(response.data.player);
      setCount(prev => {
        return { ...prev, [`${incCount}Lac`]: prev[`${incCount}Lac`] + 1 };
      });
    } catch (error) {
      console.error(
        'Error increasing bid price:',
        error.response?.data || error,
      );
    }
  };

  // Handle marking player as sold
  const handleMarkSold = async () => {
    if (!player) return;
    try {
      const response = await axios.put('/api/players', {
        playerId: player._id,
      });
      setPlayer(response.data.player);
    } catch (error) {
      console.error(
        'Error marking player as sold:',
        error.response?.data || error,
      );
    }
  };

  // Handle setting team
  const handleSetTeam = async () => {
    if (!player || !selectedTeam) return;
    try {
      const response = await axios.patch('/api/players', {
        playerId: player._id,
        teamName: selectedTeam,
      });
      setPlayer(response.data.player);
      fetchPlayer();
    } catch (error) {
      console.error('Error setting team:', error.response?.data || error);
    }
  };
  console.log(player);

  return (
    <div className="container mx-auto p-9 ">
      <div className=" w-full flex flex-col items-center gap-14">
        {!player && (
          <div className="text-xl text-yellow-500 font-extrabold">
            {categoryOrder[category] && (
              <Link
                href={`/admin/${String(categoryOrder[category]).toLowerCase()}`}
              >
                Move to Next Category ({categoryOrder[category]})
              </Link>
            )}
          </div>
        )}
        {/* <div className="min-h-[450px] max-w-[100%] md:max-w-[1000px] bg-blue-950 rounded-lg flex flex-col md:flex-row gap-3 md:gap-5 p-5 md:p-10">
          <div className="flex-[2] relative">
            <Image
              className="h-full w-full max-h-full max-w-[100%] md:max-w-[300px] object-cover rounded-lg border-4 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]"
              src={player?.image ?? "/players-image/no_user.jpg"}
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
        </div> */}
        {player ? (
          <>
            <div className="shadow-[rgba(0,_0,_0,_0.5)_0px_0px_70px_2px] border-4 border-yellow-500 z-50    w-[1000px] bg-blue-950 rounded-lg flex gap-5 p-10  ">
              <div className="flex-[2] relative">
                <Image
                  className="h-full w-full max-h-full max-w-[300px] object-cover rounded-lg border-4 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]"
                  src={player?.image ?? '/players-image/no_user.jpg'}
                  width={350}
                  height={500}
                />
                {player?.isSold ? (
                  <Image
                    className="absolute  bottom-0 left-0 tran transform"
                    src={'/sold-out.png'}
                    width={320}
                    height={320}
                  />
                ) : (
                  <></>
                )}
              </div>
              <div className="flex-[3] flex flex-col justify-between ">
                <div>
                  <h2 className="text-6xl text-center text-white mb-1 ">
                    {player?.name ?? '---'}
                  </h2>
                  <hr />
                  <h5 className="mt-2 text-2xl text-center text-white">
                    {player?.type ?? '---'}
                  </h5>
                  <h5 className="mt-2 text-2xl text-center text-white">
                    Batting style : {player?.battingStyle ?? '---'}
                  </h5>
                  <h5 className="mt-2 text-2xl text-center text-white">
                    Bowling style : {player?.bowlingStyle ?? '---'}
                  </h5>
                </div>
                <div className="text-2xl">
                  <div className="border-b-2 flex items-center gap-3 py-2">
                    <h3 className="text-yellow-400">CATEGORY :</h3>
                    <h3 className="text-white">{player?.category ?? '---'}</h3>
                  </div>
                  <div className="border-b-2 flex items-center gap-3 py-2">
                    <h3 className="text-yellow-400">BASE PRICE :</h3>
                    <h3 className="text-white">{player?.basePrice ?? '---'}</h3>
                  </div>
                  <div className="border-b-2 flex items-center gap-3 py-2">
                    <h3 className="text-yellow-400">CURRENT PRICE:</h3>
                    <h3 className="text-white">
                      {player?.currentPrice ?? '---'}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-3 justify-center items-center">
              <div className="flex gap-48">
                <button
                  onClick={() => handleIncreaseBid(5)}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                  disabled={!player?._id || player?.isSold}
                >
                  + 5Lac <br />
                  (count: {count['5Lac']})
                </button>
                <button
                  onClick={() => handleIncreaseBid(20)}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                  disabled={!player?._id || player?.isSold}
                >
                  + 20Lac <br />
                  (count: {count['20Lac']})
                </button>
                <button
                  onClick={() => handleIncreaseBid(25)}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                  disabled={!player?._id || player?.isSold}
                >
                  + 25Lac <br />
                  (count: {count['25Lac']})
                </button>
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to mark this item as sold?',
                    )
                  ) {
                    handleMarkSold();
                  }
                }}
                type="button"
                className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                disabled={!player?._id || player?.isSold}
              >
                Sold Out
              </button>

              {/* Select Team */}
              <div className="flex gap-20 items-center justify-center">
                <form className="max-w-sm mx-auto w-[600px]">
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
                    onChange={e => setSelectedTeam(e.target.value)}
                  >
                    <option value="" disabled>
                      Choose a team
                    </option>
                    <option value="ASSET EMPERORS">ASSET EMPERORS</option>
                    <option value="OC TITANS">OC TITANS</option>
                    <option value="GST GLADIOTERS">GST GLADIOTERS</option>
                    <option value="LIBERAL LIONS">LIBERAL LIONS</option>
                    <option value="TRADE TITANS">TRADE TITANS</option>
                    <option value="INFLATION INVINCIBLES">
                      INFLATION INVINCIBLES
                    </option>
                    <option value="MANAGEMENT MASTERS">
                      MANAGEMENT MASTERS
                    </option>
                    <option value="IC CHAMPIONS">IC CHAMPIONS</option>
                    <option value="RECESSION RAIDERS">RECESSION RAIDERS</option>
                    <option value="MAVERICKS">MAVERICKS</option>
                    <option value="TRESURY TACTICIANS">
                      TRESURY TACTICIANS
                    </option>
                    <option value="STOCK STRIKERS">STOCK STRIKERS</option>
                  </select>
                </form>
                <button
                  disabled={!player?._id || !player?.isSold}
                  onClick={handleSetTeam}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full mt-8"
                >
                  Sell
                </button>
              </div>
            </div>
          </>
        ) : (
          <h2 className="text-xl">All Players are sold.</h2>
        )}
      </div>
    </div>
  );
}
