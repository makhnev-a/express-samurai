import {blogCollection, postCollection} from "../../db/mongoDb";
import {IBlog} from "../../interfaces/blog.interface";
import {ObjectId} from "mongodb"
import {PaginationInterface} from "../../interfaces/pagination.interface";
import {IPost} from "../../interfaces/post.interface";

export const blogRepository = {
    async findAllBlogs(page: number, pageSize: number): Promise<PaginationInterface<IBlog[]>> {
        const totalCount = await blogCollection.countDocuments()
        const pagesCount = Math.ceil(totalCount / pageSize)
        const pageSkip = (page - 1) * pageSize
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
            totalCount,
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
    },
    async getPostsByBlogBlogId(page: number, pageSize: number, blogId: string): Promise<PaginationInterface<IPost[]>> {
        const totalCount: number = await postCollection.countDocuments({blogId})
        const pagesCount: number = Math.ceil(totalCount / pageSize)
        const pageSkip: number = (page - 1) * pageSize
        const posts: IPost[] = await postCollection.find({blogId})
            .skip(pageSkip)
            .limit(pageSize)
            .toArray()
        const mappedPosts: IPost[] = posts.map((post: IPost) => {
            return {
                id: new ObjectId(post._id).toString(),
                blogName: post.blogName,
                blogId: post.blogId,
                content: post.content,
                shortDescription: post.shortDescription,
                createdAt: post.createdAt,
                title: post.title
            }
        })

        return {
            totalCount,
            pagesCount,
            page,
            pageSize,
            items: mappedPosts
        }
    },
}