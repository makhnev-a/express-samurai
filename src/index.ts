import express, {Request, Response} from "express"
import {videoRoute} from "./routes/video.route"
import bodyParser from "body-parser"

export const app = express()
const port = 5000

app.use(bodyParser.json())

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world!12321")
})

app.use("/api/videos", videoRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})