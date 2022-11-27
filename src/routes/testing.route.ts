import express, {Request, Response} from "express"
import {clearDb} from "../db/local.db";

export const testingRoute = express.Router({})

testingRoute.delete(`/all-data`, (req: Request, res: Response) => {
    clearDb()
    res.sendStatus(204)
})