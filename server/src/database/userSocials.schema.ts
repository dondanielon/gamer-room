import mongoose from "mongoose"
const Schema = mongoose.Schema

const UserSocials = mongoose.model(
    "userSocials",
    new Schema({
        battlenetAccount: { type: String },
        xboxLiveAccount: { type: String },
        psnAccount: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: "user", required: true }
    })
)

export default UserSocials