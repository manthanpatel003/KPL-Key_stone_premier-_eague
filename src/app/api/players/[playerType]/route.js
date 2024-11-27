import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import Player from "../../../../models/Player";

export async function GET(req, { params }) {
  try {
    const { playerType } = params; // Extract playerType from the URL parameters

    // Connect to the database
    await connectToDatabase();

    // Define custom sort order for categories
    const categoryOrder = [
      "Legendary",
      "Mastery (Rank 2)",
      "Veteran (Rank 3)",
      "Aspirant (Rank 4)",
    ];

    // Fetch players based on playerType, filtering by the playerType field
    const availablePlayers = await Player.find({
      playerType,
      teamName: null,
    }).lean();

    // if (availablePlayers.length === 0) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: `No players found for type: ${playerType}`,
    //     },
    //     { status: 404 }
    //   );
    // }

    // Sort players by category based on the predefined sequence
    const sortedPlayers = availablePlayers.sort(
      (a, b) =>
        categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    );

    return NextResponse.json({ success: true, player: sortedPlayers[0] });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching players",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
