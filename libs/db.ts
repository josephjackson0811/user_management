import mongoose from 'mongoose';

const url = process.env.MONGO_URL;

async function connectToDataBase() {
  mongoose.connect(`${url}`).then(() => {
    console.log('MongoDB Connected!!!');
  });
}

export default connectToDataBase;
