import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Player from "../../../models/Player";

export async function GET(req) {
  try {
    await connectToDatabase();

    const availablePlayers = await Player.find({ teamName: "OTHERS" });

    return NextResponse.json({ success: true, players: availablePlayers });
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
