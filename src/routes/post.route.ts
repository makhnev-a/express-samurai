import express, {Request, Response} from "express";
import {posts} from "../db/local.db";
import {IPost} from "../interfaces/post.interface";
import {authMiddleware} from "../middlewares/auth.middleware";
import {contentValidate, shortDescriptionValidate, titleValidate} from "../validators/post.validator";
import {checkIdParamPost} from "../middlewares/error.middleware";

export const postRoute = express.Router({})

postRoute.get("/", (req: Request, res: Response) => {
    res.status(200).send(posts)
})

postRoute.get("/:id", (req: Request, res: Response) => {
        const postId: string = req.params.id
        const post: IPost | undefined = posts.find(post => post.id === postId)

        if (post) {
            return res.status(200).send(post)
        }

        res.sendStatus(404)
    })

postRoute.delete(
    "/:id",
    checkIdParamPost,
    authMiddleware,
    (req: Request, res: Response) => {
        const postId: string = req.params.id

        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === postId) {
                posts.splice(i, 1)

                return res.sendStatus(204)
            }
        }

        res.sendStatus(404)
})

postRoute.post(
    "/",
    authMiddleware,
    titleValidate,
    shortDescriptionValidate,
    contentValidate,
    (req: Request, res: Response) => {
        const {title, shortDescription, content, blogId, blogName} = req.body
        const post: IPost = {
            id: String(Number(new Date())),
            title,
            shortDescription,
            content,
            blogId,
            // blogName
        }

        posts.push(post)
        // const {blogName: bn, ...otherPost} = post
        res.status(201).send(post)
})

postRoute.put(
    "/:id",
    checkIdParamPost,
    authMiddleware,
    titleValidate,
    shortDescriptionValidate,
    contentValidate,
    (req: Request, res: Response) => {
        const postId: string = req.params.id
        const {title, shortDescription, content, blogId, blogName} = req.body
        const post: IPost | undefined = posts.find(post => post.id === postId)

        if (!post) {
            return res.sendStatus(404)
        }

        const postIndex = posts.findIndex(post => post.id === postId)

        posts[postIndex] = {
            ...post,
            title,
            shortDescription,
            content,
            blogId,
            blogName,
        }

        res.sendStatus(204)
})