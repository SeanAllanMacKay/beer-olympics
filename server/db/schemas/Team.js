import mongoose from 'mongoose';

let Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    playerOne: String,
    playerTwo: String,
    country: String,
    points: Number,
  },
  { collection: 'Team' }
);

mongoose.model('Team', userSchema);

export default mongoose.model('Team');
