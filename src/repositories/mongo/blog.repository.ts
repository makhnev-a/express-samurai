import {blogCollection} from "../../db/mongoDb";
import {IBlog} from "../../interfaces/blog.interface";
import {ObjectId} from "mongodb"
import {PaginationInterface} from "../../interfaces/pagination.interface";

export const blogRepository = {
    async findAllBlogs(page: number, pageSize: number): Promise<PaginationInterface<IBlog[]>> {
        const total = await blogCollection.countDocuments()
        const pagesCount = Math.ceil(total / pageSize)
        const pageSkip = (page - 1) * pageSize
        debugger
        const blogs = await blogCollection.find({})
            .skip(pageSkip)
            .limit(pageSize)
            .toArray()
        const mappedBlogs = blogs.map(blog => {
            return {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                id: new ObjectId(blog._id).toString(),
                createdAt: blog.createdAt
            }
        })

        return {
            pagesCount,
            page,
            pageSize,
            total,
            items: mappedBlogs
        }
    },
    async findOneBlog(id: string): Promise<IBlog | null> {
        try {
            const blog: IBlog | null = await blogCollection.findOne({_id: new ObjectId(id)})

            return blog ? {
                id: new ObjectId(blog._id).toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt
            } : null
        } catch (err) {
            return null
        }
    },
    async removeBlog(id: string): Promise<boolean> {
        const result = await blogCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    },
    async createBlog(newBlog: IBlog): Promise<IBlog | null> {
        try {
            const result = await blogCollection.insertOne(newBlog)

            return {
                id: new ObjectId(result.insertedId).toString(),
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl,
                createdAt: newBlog.createdAt
            }
        } catch (err) {
            return null
        }
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await blogCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name,
                description,
                websiteUrl
            }
        })

        return result.matchedCount === 1
    }
}