import express, {Request, Response} from "express"

export const testingRoute = express.Router({})

testingRoute.delete(`/all-data`, (req: Request, res: Response) => {
    res.status(200)
})