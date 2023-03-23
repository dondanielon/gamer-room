import User from "./schemas/user";
import { ISignUp } from "../types";

export async function createUser(user: ISignUp) {
    try {
        const newUser = new User({
            ...user,
            createdAt: new Date(),
        });

        await newUser.save();
    } catch (error) {
        throw error;
    }
}

export async function findUserByEmail(email: string) {
    try {
        const user = await User.findOne({ email: email });
        return user;
    } catch (error) {
        throw error;
    }
}

export async function findUserWithRefreshToken(refreshToken: string) {
    try {
        const user = await User.findOne({ refreshToken: refreshToken });
        return user;
    } catch (error) {
        throw error;
    }
}
