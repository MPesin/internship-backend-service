import mongoose from 'mongoose';

export default async function connectDB() {

  const connect = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${connect.connection.host}`.cyan.underline.bold);
}