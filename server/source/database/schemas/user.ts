import mongoose from 'mongoose'
const Schema = mongoose.Schema

const User = mongoose.model(
    'user',
    new Schema({
        username: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true 
        },
        password: {
            type: String,
            required: true
        },
        birthDate: {
            type: Date,
            required: true
        },
        creationDate: {
            type: Date,
            default: new Date()
        }
    })
)

export default User