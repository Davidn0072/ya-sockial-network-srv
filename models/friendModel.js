// models/FriendRequest.js
import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
}, { timestamps: true, versionKey: false });

friendRequestSchema.index({ toUserId: 1 });
friendRequestSchema.index({ fromUserId: 1 });
friendRequestSchema.index({ fromUserId: 1, toUserId: 1 });
friendRequestSchema.index({ toUserId: 1, status: 1 });

export default mongoose.model("FriendRequest", friendRequestSchema);