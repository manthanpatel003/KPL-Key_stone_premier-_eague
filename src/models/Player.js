import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  battingStyle: { type: String, required: true },
  bowlingStyle: { type: String, required: true },
  // playerType: {
  //   type: String,
  //   enum: ["male", "female", "faculty"],
  //   required: true,
  //   default: "male",
  // },
  category: { type: String, required: true },
  image: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  basePrice: { type: Number, required: true },
  isSold: { type: Boolean, default: false },
  teamName: { type: String, default: null },
});

export default mongoose.models.Player || mongoose.model('Player', PlayerSchema);
