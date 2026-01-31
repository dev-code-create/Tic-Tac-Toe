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

MatchSchema.index({ playedAt: -1 }); // descending order newest to oldest
MatchSchema.index({ roomId: 1, playedAt: -1 }); // first gets sorted on room id 1 , 2, 3 ,.... then in each id sort from newest to oldest

const Match = mongoose.model("Match", MatchSchema);

export default Match;
