import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const checkErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return error.msg
        }
    })
    const errorResult = myValidationResult(req)

    if (!errorResult.isEmpty()) {
        const errArray = Object.values(errorResult.mapped())

        return res.status(404).send({
            errorsMessages: errArray
        })
    }
    next()
}