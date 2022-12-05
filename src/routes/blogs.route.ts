import express, {Request, Response} from "express";
import {IBlog} from "../interfaces/blog.interface";
import {authMiddleware} from "../middlewares/auth.middleware";
import blogValidators from "../validators/blog.validator";
import {contentValidate, shortDescriptionValidate, titleValidate} from "../validators/post.validator";
import {blogRepository} from "../repositories/mongo/blog.repository";
import {PaginationInterface} from "../interfaces/pagination.interface";
import {getPageQuery} from "../utils/getPageQuery";
import {IPost} from "../interfaces/post.interface";
import {postRepository} from "../repositories/mongo/post.repository";
import {blogCollection} from "../db/mongoDb";

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
    const {page, pageSize} = getPageQuery(req.query)
    const blogs: PaginationInterface<IBlog[]> = await blogRepository.findAllBlogs(page, pageSize)
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
        const {name, description, websiteUrl} = req.body
        const blog: IBlog | null = await blogRepository.findOneBlog(blogId)

        if (!blog) {
            return res.sendStatus(404)
        }

        const isUpdate: boolean = await blogRepository.updateBlog(blogId, name, description, websiteUrl)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        res.sendStatus(204)
    })

blogsRoute.get("/:id/posts", async (req: Request, res: Response) => {
    const blogId: string = req.params.id
    const {page, pageSize} = getPageQuery(req.query)
    const postsByBlogId: PaginationInterface<IPost[]> = await blogRepository.getPostsByBlogBlogId(page, pageSize, blogId)

    res.status(200).send(postsByBlogId)
})

blogsRoute.post(
    "/:id/posts",
    authMiddleware,
    ...titleValidate,
    ...shortDescriptionValidate,
    ...contentValidate,
    async (req: Request, res: Response) => {
        const blogId: string = req.params.id
        const {title, shortDescription, content} = req.body
        const blog: IBlog | null = await blogRepository.findOneBlog(blogId)

        if (!blog) {
            return res.sendStatus(404)
        }

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