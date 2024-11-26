import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import Player from "../../../../models/Player";

export async function GET(req, { params }) {
  try {
    const { playerType } = params; // Extract playerType from the URL parameters

    // Connect to the database
    await connectToDatabase();

    // Fetch players based on playerType, filtering by the playerType field
    const availablePlayers = await Player.find({ playerType, teamName: null });

    if (availablePlayers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `No players found for type: ${playerType}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, player: availablePlayers[0] });
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
