import mongoose, { Schema } from "mongoose";

const likedProfile = new Schema({
    likedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    liked: { type: Boolean },
    timestamp: { type: Date, default: Date.now },
})

export const likedByProfile = mongoose.model("likedProfile", likedProfile)