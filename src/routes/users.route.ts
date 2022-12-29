import {Request, Response, Router} from "express";
import {getPageQuery} from "../utils/queryParams";
import {PaginationInterface} from "../interfaces/pagination.interface";
import {IUser} from "../interfaces/user.interface";
import {userRepositories} from "../repositories/mongo/user.repositories";
import {authMiddleware} from "../middlewares/auth.middleware";
import usersValidators from "../validators/user.validator"

export const usersRoute = Router({})

usersRoute.get(
    "/",
    authMiddleware,
    async (req: Request, res: Response) => {
        const {page, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = getPageQuery(req.query)
        const users: PaginationInterface<IUser[]> = await userRepositories.getAllUsers(page, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm)
        return res.status(200).send(users)
    })

usersRoute.post(
    "/",
    authMiddleware,
    // [...usersValidators],
    async (req: Request, res: Response) => {
        const {login, password, email} = req.body
        const user: IUser | null = await userRepositories.createUser(login, password, email)

        if (user) {
            return res.status(201).send(user)
        }

        return res.sendStatus(400)
    })

usersRoute.delete(
    "/:id",
    authMiddleware,
    async (req: Request, res: Response) => {
        const id: string = req.params.id
        const isDeleted: boolean = await userRepositories.deleteUserById(id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        res.sendStatus(204)
    })