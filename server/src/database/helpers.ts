import User from "./user.schema";
import { ISignup } from "../types/handlers";
import Friendship from "./friendship.schema";

export async function createUser(user: ISignup) {
    try {
        const newUser = new User({
            ...user,
            createdAt: new Date(),
        });

        await newUser.save()
    } catch (error) {
        throw error
    }
}

export async function findUserByEmail(email: string) {
    try {
        const user = await User.findOne({ email: email })
        return user
    } catch (error) {
        throw error
    }
}

export async function findUserById(id: string) {
    try {
        const user = await User.findById(id)
        return user
    } catch (error) {
        throw error
    }
}

export async function findUserWithRefreshToken(refreshToken: string) {
    try {
        const user = await User.findOne({ refreshToken: refreshToken })
        return user
    } catch (error) {
        throw error
    }
}

export async function createFriendship(sender: string, receiver: string) {
    try {
        const friendRequest = new Friendship({
            sender: sender,
            receiver: receiver,
            createdAt: new Date()
        })
        await friendRequest.save()
    } catch (error) {
       throw error 
    }
}

export async function getFriendList(userId: string) {
    try {
        const friendList = await Friendship.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        return friendList
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function acceptFriendship(friendshipId: string) {
    try {
        await Friendship.findByIdAndUpdate(friendshipId, {
            status: "accepted",
            acceptedAt: new Date()
        })
    } catch (error) {
        throw error
    }
}