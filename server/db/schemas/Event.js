import mongoose from 'mongoose';

let Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    title: String,
    rounds: [
      [
        {
          teams: [String, String],
          winner: String,
        },
      ],
    ],
  },
  { collection: 'Game' }
);

mongoose.model('Game', userSchema);

export default mongoose.model('Game');
