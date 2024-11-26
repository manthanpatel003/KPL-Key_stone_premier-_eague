import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Player from "../../../models/Player";

// POST API to add player (without file upload)
export async function POST(req) {
  await connectToDatabase();

  try {
    // Manually parsing the incoming request body
    const formData = await req.json();

    const {
      name,
      type,
      currentPrice,
      basePrice,
      imageName,
      category,
      battingStyle,
      bowlingStyle,
      playerType,
    } = formData;

    // Validate the required fields
    if (
      !name ||
      !currentPrice ||
      !basePrice ||
      !imageName ||
      !category ||
      !type ||
      !battingStyle ||
      !bowlingStyle ||
      !playerType
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const imagePath = `/players-image/${imageName}`;

    // Create and save a new player
    const newPlayer = new Player({
      name,
      category,
      type: type,
      image: imagePath,
      currentPrice: parseInt(currentPrice),
      basePrice: parseInt(basePrice),
      isSold: false,
      teamName: null,
    });

    const savedPlayer = await newPlayer.save();

    return NextResponse.json({
      message: "Player added successfully",
      player: savedPlayer,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// GET API to fetch all available players (no team assigned)
export async function GET(req) {
  try {
    await connectToDatabase();

    const availablePlayers = await Player.find({ teamName: null });

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

// PUT API to mark a player as sold
export async function PUT(req) {
  try {
    await connectToDatabase();

    const { playerId } = await req.json();
    const player = await Player.findById(playerId);

    if (!player) {
      return NextResponse.json(
        { success: false, message: "Player not found" },
        { status: 404 }
      );
    }

    player.isSold = true;
    await player.save();

    return NextResponse.json({
      success: true,
      message: "Player marked as sold",
      player,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error marking player as sold",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH API to set the team name for a player
export async function PATCH(req) {
  try {
    await connectToDatabase();

    const { playerId, teamName } = await req.json();
    const player = await Player.findById(playerId);

    if (!player) {
      return NextResponse.json(
        { success: false, message: "Player not found" },
        { status: 404 }
      );
    }

    player.teamName = teamName;
    await player.save();

    return NextResponse.json({
      success: true,
      message: "Team name updated",
      player,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating team name",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
