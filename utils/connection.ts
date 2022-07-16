import mongoose, { Schema } from 'mongoose';

const { DATABASE_URL } = process.env;

export const connect = async () => {
  const conn = await mongoose
    .connect(DATABASE_URL as string)
    .catch((err) => console.log(err));
  console.log('Mongoose Connection Established!');

  const OperationSchema = new mongoose.Schema(
    {
      name: String,
      amount: Number,
      date: Date,
      type: String,
      category: String,
      author: String,
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );
  const Operation =
    mongoose.models.Operation || mongoose.model('Operation', OperationSchema);
  return { conn, Operation };
};
