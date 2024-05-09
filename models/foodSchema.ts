import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  food: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.models.Food || mongoose.model('Food', foodSchema);
