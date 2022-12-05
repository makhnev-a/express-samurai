import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {IPost} from "../interfaces/post.interface";
import {postRepository} from "../repositories/mongo/post.repository";

export const checkErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    debugger
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

export const checkIdParamPost = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id
    const post: IPost | null = await postRepository.findOnePost(id)

    if (!post) {
        return res.sendStatus(404)
    }

    next()
}