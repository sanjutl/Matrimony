import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    notified: { type: Boolean, default: false }
})

export const Notification = mongoose.model("Notification", notificationSchema);