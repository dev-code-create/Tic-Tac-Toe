import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true,
  },
  players: [
    {
      name: String,
      symbol: {
        type: String,
        enum: ["X", "O"],
      },
    },
  ],
  winner: {
    type: String,
    required: true,
    enum: ["X", "O", "Draw"],
  },
  playedAt: {
    type: Date,
    default: Date.now,
  },
  moves: {
    type: Number,
    default: 0,
  },
});

const Match = mongoose.model("Match", MatchSchema);

export default Match;
