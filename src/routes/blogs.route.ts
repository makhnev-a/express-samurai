import express, {Request, Response} from "express";
import {IBlog} from "../interfaces/blog.interface";
import {authMiddleware} from "../middlewares/auth.middleware";
import blogValidators from "../validators/blog.validator";
import {blogRepository} from "../repositories/mongo/blog.repository";

export const blogsRoute = express.Router({})

blogsRoute.post(
    "/",
    authMiddleware,
    [...blogValidators],
    async (req: Request, res: Response) => {
        const {name, description, websiteUrl} = req.body
        const blog: IBlog | null = await blogRepository.createBlog({
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString()
        })

        if (!blog) {
            return res.sendStatus(404)
        }

        res.status(201).send(blog)
    })

blogsRoute.get("/", async (req: Request, res: Response) => {
    const blogs: IBlog[] = await blogRepository.findAllBlogs()
    res.status(200).send(blogs)
})

blogsRoute.get("/:id", async (req: Request, res: Response) => {
    const blogId: string = req.params.id
    const blog: IBlog | null = await blogRepository.findOneBlog(blogId)

    if (blog) {
        return res.status(200).send(blog)
    }

    res.sendStatus(404)
})

blogsRoute.delete(
    "/:id",
    authMiddleware,
    async (req: Request, res: Response) => {
        const blogId: string = req.params.id

        const blog: IBlog | null = await blogRepository.findOneBlog(blogId)

        if (!blog) {
            return res.sendStatus(404)
        }

        const isDeleted: boolean = await blogRepository.removeBlog(blogId)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        res.sendStatus(204)
    })

blogsRoute.put(
    "/:id",
    authMiddleware,
    [...blogValidators],
    async (req: Request, res: Response) => {
        const blogId: string = req.params.id
        const {name, shortDescription, websiteUrl} = req.body
        const blog: IBlog | null = await blogRepository.findOneBlog(blogId)

        if (!blog) {
            return res.sendStatus(404)
        }

        const isUpdate: boolean = await blogRepository.updateBlog(blogId, name, shortDescription, websiteUrl)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        res.sendStatus(204)
    })