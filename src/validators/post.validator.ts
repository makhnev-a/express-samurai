import {body} from "express-validator";
import {IBlog} from "../interfaces/blog.interface";
import {blogs} from "../db/local.db";
import {checkErrorsMiddleware} from "../middlewares/error.middleware";
import {blogRepository} from "../repositories/mongo/blog.repository";

export const titleValidate = [
    body("title")
        .exists()
        .withMessage({
            message: "title field is not exist",
            field: "title"
        }),
    body("title")
        .trim()
        .isLength({min: 1, max: 30})
        .withMessage({
            message: "title field > 30 chars",
            field: "title"
        })
]

export const shortDescriptionValidate = [
    body("shortDescription")
        .exists()
        .withMessage({
            message: "shortDescription field is not exist",
            field: "shortDescription"
        }),
    body("shortDescription")
        .trim()
        .isLength({min: 1, max: 100})
        .withMessage({
            message: "shortDescription field > 100 chars",
            field: "shortDescription"
        })
]

export const contentValidate = [
    body("content")
        .exists()
        .withMessage({
            message: "content field is not exist",
            field: "content"
        }),
    body("content")
        .trim()
        .isLength({min: 1, max: 1000})
        .withMessage({
            message: "content field > 1000 chars",
            field: "content"
        })
]

export const blogIdValidate = [
    body("blogId")
        .exists()
        .withMessage({
            message: "blogId field is not exist",
            field: "blogId"
        }),
    body("blogId")
        .isString()
        .withMessage({
            message: "blogId is not a string",
            field: "blogId"
        }),
    body("blogId")
        .custom(async (value) => {
            const blog: IBlog | null = await blogRepository.findOneBlog(value)

            if (!blog) {
                throw ({
                    message: "blog not found",
                    field: "blogId"
                })
            }
            return true
        }),
]

export default [
    ...titleValidate,
    ...shortDescriptionValidate,
    ...contentValidate,
    ...blogIdValidate,
    checkErrorsMiddleware
]