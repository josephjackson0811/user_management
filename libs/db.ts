import mongoose from 'mongoose';

import { config } from '@/config';

async function connectToDataBase() {
  mongoose.connect(config.mongoURL).then(() => {
    console.log('MongoDB connected!!!');
  });
}

export default connectToDataBase;
