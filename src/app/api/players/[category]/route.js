import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import Player from '../../../../models/Player';

export async function GET(req, { params }) {
  try {
    const { category } = params; // Extract playerType from the URL parameters

    // Connect to the database
    await connectToDatabase();

    // Define custom sort order for categories
    // const categoryOrder = [
    //   'Legendary',
    //   'Faculty',
    //   'Mastery',
    //   'Veteran',
    //   'Aspirant',
    //   'Girls',
    // ];

    // Fetch players based on playerType, filtering by the playerType field
    const availablePlayers = await Player.find({
      category: { $regex: new RegExp(category, 'i') }, // Case-insensitive match
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
    // const sortedPlayers = availablePlayers.sort(
    //   (a, b) =>
    //     categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category),
    // );

    return NextResponse.json({ success: true, player: availablePlayers[0] });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching players',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
