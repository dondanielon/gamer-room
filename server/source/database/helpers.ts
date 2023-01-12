import User from './schemas/user'
import { SignUpI } from '../types'

export async function createUser(user: SignUpI) {
    try {
        if (!user) {
            throw new Error('You must provide user as parameter')
        }

        const newUser = new User(user)
        await newUser.save()

        return {
            message: 'user created',
            data: null
        }

    } catch (error) {
        throw error
    }
}