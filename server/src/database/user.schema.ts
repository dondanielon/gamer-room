import mongoose from "mongoose"
const Schema = mongoose.Schema

const User = mongoose.model(
    "user",
    new Schema({
        username: { type: String, required: true, unique: true, index: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        birthDate: { type: Date, required: true },
        createdAt: { type: Date, required: true },
        isConfirmed: { type: Boolean, required: true, default: false },
        profileImage: { type: String, required: true },
        socials: { type: Schema.Types.ObjectId, ref: "userSocials" }, 
        refreshToken: { 
            type: String, 
            select: false, 
            index: {
                unique: true,
                partialFilterExpression: {
                    refreshToken: { $type: "string" }
                }
            }
        }
    })
)

export default User