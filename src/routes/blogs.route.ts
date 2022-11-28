import express, {Request, Response} from "express";
import {blogs} from "../db/local.db";
import {IBlog} from "../interfaces/blog.interface";
import {authMiddleware} from "../middlewares/auth.middleware";
import blogValidators from "../validators/blog.validator";

export const blogsRoute = express.Router({})

blogsRoute.post(
    "/",
    authMiddleware,
    [...blogValidators],
    (req: Request, res: Response) => {
        const {name, description, websiteUrl} = req.body
        const blog: IBlog = {
            id: String(Number(new Date())),
            name,
            description,
            websiteUrl
        }

        blogs.push(blog)
        res.status(201).send(blog)
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

blogsRoute.delete(
    "/:id",
    authMiddleware,
    (req: Request, res: Response) => {
        const blogId: string = req.params.id

        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].id === blogId) {
                blogs.splice(i, 1)

                return res.sendStatus(204)
            }
        }

        res.sendStatus(404)
    })

blogsRoute.put(
    "/:id",
    authMiddleware,
    [...blogValidators],
    (req: Request, res: Response) => {
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