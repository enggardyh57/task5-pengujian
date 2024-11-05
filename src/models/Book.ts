import mongoose, { Document, Schema } from "mongoose";

interface IBook extends Document {
  title: string;
  author: string;
  year: number;
  genre: string;
}

const bookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
});

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
