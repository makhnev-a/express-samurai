import express, {Request, Response} from "express";
import { blogs } from "../db/local.db";
import {IBlog} from "../interfaces/blog.interface";
import {atob} from "buffer";

export const blogsRoute = express.Router({})

blogsRoute.post("/", (req: Request, res: Response) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    const authDataRaw = atob(req.headers.authorization.replace("Basic ", ""))
    const basicData = authDataRaw.split(":")

    if (basicData[0] === "admin" && basicData[1] === "qwerty") {
        const {name, description, websiteUrl} = req.body
        const blog: IBlog = {
            id: String(Number(new Date())),
            name,
            description,
            websiteUrl
        }

        blogs.push(blog)
        return res.status(201).send(blog)
    }

    return res.sendStatus(401)
})

blogsRoute.get("/", (req: Request, res: Response) => {
    res.status(200).send(blogs)
})

blogsRoute.get("/:id", (req: Request, res: Response) => {
    const blogId: string = req.params.id
    const blog: IBlog | undefined = blogs.find(blog => blog.id === blogId)

    if (blog) {
        return res.status(200).send(blog)
    }

    res.sendStatus(404)
})

blogsRoute.delete("/:id", (req: Request, res: Response) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    const authDataRaw = atob(req.headers.authorization.replace("Basic ", ""))
    const basicData = authDataRaw.split(":")

    if (basicData[0] === "admin" && basicData[1] === "qwerty") {
        const blogId: string = req.params.id

        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].id === blogId) {
                blogs.splice(i, 1)

                return res.sendStatus(204)
            }
        }

        return res.sendStatus(404)
    }

    return res.sendStatus(401)
})


/** Update blog route */
blogsRoute.put("/:id", (req: Request, res: Response) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    const authDataRaw = atob(req.headers.authorization.replace("Basic ", ""))
    const basicData = authDataRaw.split(":")

    if (basicData[0] === "admin" && basicData[1] === "qwerty") {
        const blogId: string = req.params.id
        const {name, description, websiteUrl} = req.body
        const blog: IBlog | undefined = blogs.find(blog => blog.id === blogId)

        if (!blog) {
            return res.sendStatus(404)
        }

        const blogIndex = blogs.findIndex(blog => blog.id === blogId)

        blogs[blogIndex] = {
            ...blog,
            name,
            description,
            websiteUrl
        }

        return res.sendStatus(204)
    }

    res.sendStatus(401)
})