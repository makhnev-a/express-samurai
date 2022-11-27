import express, {Request, Response} from "express";
import { blogs } from "../db/local.db";
import {IBlog} from "../interfaces/blog.interface";
import {videoRoute, videos} from "./video.route";

export const blogsRoute = express.Router({})

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
    const blogId: string = req.params.id

    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].id === blogId) {
            blogs.splice(i, 1)

            return res.sendStatus(204)
        }
    }

    res.sendStatus(404)
})

videoRoute.post("/", (req: Request, res: Response) => {
    const {name, description, websiteUrl} = req.body
    const blog: IBlog = {
        id: String(new Date()),
        name,
        description,
        websiteUrl
    }

    blogs.push(blog)
    res.status(201).send(blog)
})

/** Update blog route */
blogsRoute.put("/:id", (req: Request, res: Response) => {
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

    res.sendStatus(204)
})