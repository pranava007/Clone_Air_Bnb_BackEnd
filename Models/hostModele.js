import mongoose from "mongoose";

const hostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  }],
}, {
  timestamps: true,
});

const Host = mongoose.model('Host', hostSchema);
export default Host;
