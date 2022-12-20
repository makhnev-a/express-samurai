import {body} from "express-validator";
import {checkErrorsMiddleware} from "../middlewares/error.middleware";

export const loginValidate = [
    body("login")
        .exists()
        .withMessage({
            message: "login field is not exist",
            field: "login"
        }),
    body("login")
        .trim()
        .isLength({min: 3, max: 10})
        .withMessage({
            message: "login field > 10 or < 3 chars",
            field: "login"
        }),
    body("login")
        .matches(/^[a-zA-Z0-9_-]*$/)
        .withMessage({
            "message": "login bad pattern",
            "field": "login"
        })
]

export const emailValidate = [
    body("email")
        .exists()
        .withMessage({
            message: "email field is not exist",
            field: "email"
        }),
    body("email")
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage({
            "message": "email bad url",
            "field": "email"
        })
]

export const passwordValidate = [
    body("password")
        .exists()
        .withMessage({
            message: "password field is not exist",
            field: "password"
        }),
    body("password")
        .trim()
        .isLength({min: 6, max: 20})
        .withMessage({
            message: "login field > 20 or < 6 chars",
            field: "password"
        })
]

export default [
    ...loginValidate,
    ...passwordValidate,
    ...emailValidate,
    checkErrorsMiddleware
]