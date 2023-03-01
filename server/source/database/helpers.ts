import User from './schemas/user'
import { SignUpI, ResponseI } from '../types'

export async function createUser(user: SignUpI): Promise<ResponseI> {
    try {
        if (!user) throw new Error('You must provide user as parameter')

        const newUser = new User({
            ...user,
            createdAt: new Date()
        })

        await newUser.save()

        return {
            message: 'user created',
            data: null
        }

    } catch (error) {
        throw error
    }
}