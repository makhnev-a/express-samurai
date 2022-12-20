import {MongoClient} from "mongodb";
import {IPost} from "../interfaces/post.interface";
import {IBlog} from "../interfaces/blog.interface";
import {config} from "../config";
import { IUser } from "../interfaces/user.interface";

const mongoURI = config.dbURL || "mongodb://0.0.0.0:27017/?maxPollSize=20&w=majority"
// const mongoURI = process.env.MONGO_URI || "mongodb://0.0.0.0:27017/?maxPollSize=20&w=majority"
const client = new MongoClient(mongoURI)
const db = client.db("samurai")

export const postCollection = db.collection<IPost>("post")
export const blogCollection = db.collection<IBlog>("blog")
export const userCollection = db.collection<IUser>("user")

export async function runDb() {
    try {
        await client.connect()
        await client.db("samurai").command({ping: 1})

        console.log("Connection successfully to mongo server")
    } catch (err) {
        console.log("Connection error", err)
        await client.close()
    }
}