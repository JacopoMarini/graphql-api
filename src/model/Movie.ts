import mongoose, { Document, Schema } from "mongoose";

export interface IMovie extends Document {
  title: string;
  genre: string;
  rating: number;
  duration: string;
}

const movieSchema: Schema<IMovie> = new Schema(
  {
    title: { type: String, required: true, unique: true },
    genre: { type: String, required: true },
    rating: { type: Number, required: true },
    duration: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMovie>("Movie", movieSchema);
