import express, {Request, Response} from "express"
import {videoRoute} from "./routes/video.route"
import bodyParser from "body-parser"
import {blogsRoute} from "./routes/blogs.route";
import {postRoute} from "./routes/post.route";
import {testingRoute} from "./routes/testing.route";
import {runDb} from "./db/mongoDb";
import dotenv from "dotenv";
import {loginRoute} from "./routes/login.route";
import {usersRoute} from "./routes/users.route";

export const app = express()
dotenv.config()
const port = 5000

app.use(bodyParser.json())

app.use("/api/videos", videoRoute)
app.use("/api/blogs", blogsRoute)
app.use("/api/posts", postRoute)
app.use("/api/testing", testingRoute)
app.use("/api/auth", loginRoute)
app.use("/api/users", usersRoute)

const startApp = async () => {
    await runDb()

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()