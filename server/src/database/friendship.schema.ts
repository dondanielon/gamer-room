import mongoose from "mongoose"
const Schema = mongoose.Schema

const Friendship = mongoose.model(
    "friendship",
    new Schema({
        sender: { type: Schema.Types.ObjectId, required: true },
        receiver: { type: Schema.Types.ObjectId, required: true },
        status: { type: String, required: true, enum: ["pending" || "accepted" || "declined"] },
        createdAt: { type: Date, required: true },
        acceptedAt: { type: Date }
    })
)

export default Friendship