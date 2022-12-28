import {blogCollection, postCollection} from "../../db/mongoDb";
import {IBlog} from "../../interfaces/blog.interface";
import {ObjectId} from "mongodb"
import {PaginationInterface} from "../../interfaces/pagination.interface";
import {IPost} from "../../interfaces/post.interface";
import {sortGetValues} from "../../utils/sort";

export const blogRepository = {
    async findAllBlogs(page: number, pageSize: number, sortBy: string, sortDirection: string, searchNameTerm: string): Promise<PaginationInterface<IBlog[]>> {
        const search = !searchNameTerm ? "" : searchNameTerm
        const totalCount = await blogCollection.countDocuments({name: {$regex: search, $options: "-i"}})
        const pagesCount = Math.ceil(totalCount / pageSize)
        const pageSkip = (page - 1) * pageSize
        const sort = sortGetValues(sortBy, sortDirection)

        const blogs = await blogCollection.find({name: {$regex: search, $options: "-i"}})
            .skip(pageSkip)
            .limit(pageSize)
            .sort(sort)
            .toArray()
        const mappedBlogs = blogs.map(blog => {
            return {
                id: new ObjectId(blog._id).toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
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
    async getPostsByBlogBlogId(page: number, pageSize: number, sortBy: string, sortDirection: string, blogId: string): Promise<PaginationInterface<IPost[]>> {
        const totalCount: number = await postCollection.countDocuments({blogId})
        const pagesCount: number = Math.ceil(totalCount / pageSize)
        const pageSkip: number = (page - 1) * pageSize
        const sort = sortGetValues(sortBy, sortDirection)
        const posts: IPost[] = await postCollection.find({blogId})
            .skip(pageSkip)
            .limit(pageSize)
            .sort(sort)
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
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: mappedPosts
        }
    },
}