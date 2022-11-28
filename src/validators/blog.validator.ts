import {body} from "express-validator"
import {checkErrorsMiddleware} from "../middlewares/error.middleware";

export const nameValidate = [
    body("name")
        .exists()
        .withMessage({
            message: "name field is not exist",
            field: "name"
        }),
    body("name")
        .trim()
        .isLength({min: 1, max: 15})
        .withMessage({
            message: "name field > 15 chars",
            field: "name"
        })
]

export const descriptionValidate = [
    body("description")
        .exists()
        .withMessage({
            message: "description field is not exist",
            field: "description"
        }),
    body("description")
        .trim()
        .isLength({min: 1, max: 500})
        .withMessage({
            message: "description field > 500 chars",
            field: "description"
        })
]

export const websiteUrlValidate = [
    body("websiteUrl")
        .exists()
        .withMessage({
            message: "websiteUrl field is not exist",
            field: "websiteUrl"
        }),
    body("websiteUrl")
        .trim()
        .isLength({min: 1, max: 100})
        .withMessage({
            message: "websiteUrl field > 100 chars",
            field: "websiteUrl"
        }),
    body("websiteUrl")
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage({
            "message": "websiteUrl bad url",
            "field": "websiteUrl"
        }),
]

export default [
    ...nameValidate,
    ...descriptionValidate,
    ...websiteUrlValidate,
    checkErrorsMiddleware
]