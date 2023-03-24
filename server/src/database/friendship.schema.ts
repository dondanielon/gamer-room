import mongoose from "mongoose"
const Schema = mongoose.Schema

const Friendship = mongoose.model(
    "friendship",
    new Schema({
        sender: { type: Schema.Types.ObjectId, required: true, index: true },
        receiver: { type: Schema.Types.ObjectId, required: true, index: true },
        status: { type: String, required: true, enum: ["pending" || "accepted" || "declined"], default: "pending" },
        createdAt: { type: Date, required: true },
        acceptedAt: { type: Date }
    })
)

export default Friendship