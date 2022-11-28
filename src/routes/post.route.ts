import express, {Request, Response} from "express";
import { posts } from "../db/local.db";
import {IPost} from "../interfaces/post.interface";

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

postRoute.delete("/:id", (req: Request, res: Response) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    const authDataRaw = req.headers.authorization.replace("Basic ", "")
    const basicData = authDataRaw.split(":")

    if (basicData[0] === "admin" && basicData[1] === "qwerty") {
        const postId: string = req.params.id

        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === postId) {
                posts.splice(i, 1)

                return res.sendStatus(204)
            }
        }

        return res.sendStatus(404)
    }

    return res.sendStatus(401)
})

postRoute.post("/", (req: Request, res: Response) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    const authDataRaw = req.headers.authorization.replace("Basic ", "")
    const basicData = authDataRaw.split(":")

    if (basicData[0] === "admin" && basicData[1] === "qwerty") {
        const {title, shortDescription, content, blogId, blogName} = req.body
        const post: IPost = {
            id: String(Number(new Date())),
            title,
            shortDescription,
            content,
            blogId,
            blogName
        }

        posts.push(post)
        return res.status(201).send(post)
    }

    return res.sendStatus(401)
})

postRoute.put("/:id", (req: Request, res: Response) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    const authDataRaw = req.headers.authorization.replace("Basic ", "")
    const basicData = authDataRaw.split(":")

    if (basicData[0] === "admin" && basicData[1] === "qwerty") {
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

        return res.sendStatus(204)
    }

    return res.sendStatus(401)
})

