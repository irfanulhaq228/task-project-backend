import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.ObjectId, ref: "User" },
    heading: { type: String, required: true },
    description: { type: String },
    images: [{ type: String, required: true }],
}, { timestamps: true });

const PostModel = new mongoose.model("Post", postSchema);
export default PostModel;