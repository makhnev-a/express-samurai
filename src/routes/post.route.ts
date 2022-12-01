import express, {Request, Response} from "express";
import {IPost} from "../interfaces/post.interface";
import {authMiddleware} from "../middlewares/auth.middleware";
import postValidate from "../validators/post.validator";
import {checkErrorsMiddleware, checkIdParamPost} from "../middlewares/error.middleware";
import {IBlog} from "../interfaces/blog.interface";
import {postRepository} from "../repositories/mongo/post.repository";
import {blogRepository} from "../repositories/mongo/blog.repository";

export const postRoute = express.Router({})

postRoute.get("/", async (req: Request, res: Response) => {
    const posts: IPost[] = await postRepository.findAllPosts()
    res.status(200).send(posts)
})

postRoute.get("/:id", async (req: Request, res: Response) => {
    const postId: string = req.params.id
    const post: IPost | null = await postRepository.findOnePost(postId)

    if (post) {
        return res.status(200).send(post)
    }

    res.sendStatus(404)
})

postRoute.delete(
    "/:id",
    checkIdParamPost,
    authMiddleware,
    async (req: Request, res: Response) => {
        const postId: string = req.params.id
        const isDeleted: boolean = await postRepository.removePost(postId)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        res.sendStatus(204)
    })

postRoute.post(
    "/",
    authMiddleware,
    // [
    //     ...titleValidate,
    //     ...shortDescriptionValidate,
    //     ...contentValidate,
    //     ...blogIdValidate
    // ],
    postValidate,
    checkErrorsMiddleware,
    async (req: Request, res: Response) => {
        const {title, shortDescription, content, blogId} = req.body
        const blog: IBlog | null = await blogRepository.findOneBlog(blogId)
        const post: IPost | null = await postRepository.createPost({
            createdAt: new Date().toISOString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog?.name
        })

        res.status(201).send(post)
    })

postRoute.put(
    "/:id",
    checkIdParamPost,
    authMiddleware,
    // [
    //     ...titleValidate,
    //     ...shortDescriptionValidate,
    //     ...contentValidate,
    //     ...blogIdValidate
    // ],
    postValidate,
    checkErrorsMiddleware,
    async (req: Request, res: Response) => {
        const postId: string = req.params.id
        const {title, shortDescription, content, blogId} = req.body

        const post: IPost | null = await postRepository.findOnePost(postId)
        const blog: IBlog | null = await blogRepository.findOneBlog(blogId)

        if (!post) {
            return res.sendStatus(404)
        }

        await postRepository.updatePost(
            postId,
            title,
            shortDescription,
            content,
            blogId
        )

        res.sendStatus(204)
    })