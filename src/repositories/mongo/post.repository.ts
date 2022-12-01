import {IPost} from "../../interfaces/post.interface";
import {postCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";

export const postRepository = {
    async findAllPosts(): Promise<IPost[]> {
        const posts: IPost[] = await postCollection.find({}).toArray()

        return posts.map(post => {
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
    },
    async findOnePost(id: string): Promise<IPost | null> {
        try {
            const post: IPost | null = await postCollection.findOne({_id: new ObjectId(id)})

            return post ? {
                id: new ObjectId(post._id).toString(),
                blogId: post.blogId,
                blogName: post.blogName,
                content: post.content,
                shortDescription: post.shortDescription,
                title: post.title,
                createdAt: post.createdAt
            } : null
        } catch (err) {
            return null
        }
    },
    async removePost(id: string): Promise<boolean> {
        const result = await postCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    },
    async createPost(newPost: IPost): Promise<IPost | null> {
        try {
            const result = await postCollection.insertOne(newPost)

            return {
                id: new ObjectId(result.insertedId).toString(),
                blogName: newPost.blogName,
                blogId: newPost.blogId,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                title: newPost.title,
                createdAt: newPost.createdAt
            }
        } catch (err) {
            return null
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await postCollection.updateOne({_id: new ObjectId(id)}, {
            title,
            shortDescription,
            content,
            blogId
        })

        return result.matchedCount === 1
    }
}