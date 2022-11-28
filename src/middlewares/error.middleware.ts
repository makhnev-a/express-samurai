import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {IPost} from "../interfaces/post.interface";
import {posts} from "../db/local.db";

export const checkErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return error.msg
        }
    })
    const errorResult = myValidationResult(req)

    if (!errorResult.isEmpty()) {
        const errArray = Object.values(errorResult.mapped())

        return res.status(400).send({
            errorsMessages: errArray
        })
    }
    next()
}

export const checkIdParamPost = (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id
    const post: IPost | undefined = posts.find(post => post.id === id)

    if (!post) {
        return res.sendStatus(404)
    }

    next()
}