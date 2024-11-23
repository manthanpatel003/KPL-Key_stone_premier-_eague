import { connectToDatabase } from "@/lib/mongodb";
import Player from "@/models/Player";
import { NextResponse } from "next/server";

// PUT API to update the current price for a player
export async function PUT(req) {
  try {
    await connectToDatabase();

    const { playerId, newPrice } = await req.json();
    const player = await Player.findById(playerId);

    if (!player) {
      return NextResponse.json(
        { success: false, message: "Player not found" },
        { status: 404 }
      );
    }

    player.currentPrice = newPrice;
    await player.save();

    return NextResponse.json({
      success: true,
      message: "Price updated",
      player,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating price", error: error.message },
      { status: 500 }
    );
  }
}
