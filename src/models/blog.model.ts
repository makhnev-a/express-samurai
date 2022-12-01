import {Schema, model} from "mongoose";
import {IBlog} from "../interfaces/blog.interface";

const blogSchema = new Schema<IBlog>({
    name: String,
    description: String,
    websiteUrl: String,
    id: String,
}, {
    timestamps: true
})

const Blog = model("Blog", blogSchema)

export default Blog