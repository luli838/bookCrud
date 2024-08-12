import { mongoose } from "mongoose";
export const { ObjectId } = mongoose.Types;
const currentYear = new Date().getFullYear();

//Mongo DB Schema
const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: { type: String, required: true, trim: true },
    year: {
      type: Number,
      required: true,
      min: [1700, "Year must be al least 1700"],
      max: [currentYear, `Year cannot exceed ${currentYear}`],
    },
    genre: { type: [String], required: true, trim: true },
    
  },
  { timestamps: true }
);
bookSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});


export const Book = mongoose.model("Book", bookSchema);
