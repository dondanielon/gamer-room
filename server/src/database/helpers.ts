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

export async function findUsername(username: string) {
    try {
        // TODO: limit query results waiting on client connection to set number
        const query = new RegExp(username, 'i')
        const list = await User.find({ username: query }).select({
            lastName: 0,
            email: 0,
            password: 0,
            birthDate: 0,
            createdAt: 0,
            isConfirmed: 0,
            __v: 0,
            refreshToken: 0
        }).sort({ username: "asc"})
        return list
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

export async function friendshipResponse(friendshipId: string, status: "accepted" | "rejected") {
    try {
        if (status === "accepted") {
            await Friendship.findByIdAndUpdate(friendshipId, {
                status: status,
                acceptedAt: new Date()
            })
        } else {
            await Friendship.findByIdAndDelete(friendshipId)
        }  
    } catch (error) {
        throw error
    }
}

export async function deleteFriendship(friendshipId: string) {
    try {
        await Friendship.findByIdAndDelete(friendshipId)
    } catch (error) {
        throw error
    }
}