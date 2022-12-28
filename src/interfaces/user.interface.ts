import {ObjectId} from "mongodb";

export interface IUser {
    _id?: ObjectId
    id?: string
    login: string
    password?: string
    email: string
    createdAt: string
}