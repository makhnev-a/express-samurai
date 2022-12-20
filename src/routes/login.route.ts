import {Request, Response, Router} from "express";
import {authRepository} from "../repositories/mongo/auth.repository";

export const loginRoute = Router({})

loginRoute.post("/", async (req: Request, res: Response) => {
    const {loginOrEmail, password} = req.body
    const isLogin = await authRepository.login(loginOrEmail, password)

    if (isLogin) {
        return res.sendStatus(204)
    }

    return res.sendStatus(401)
})