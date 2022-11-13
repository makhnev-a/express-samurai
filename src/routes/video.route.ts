import express, {Request, Response} from "express"
import {IVideo, Resolutions} from "../interfaces/video.interface";

export let videos = [
    {
        id: 1,
        title: "React video",
        author: "Dan Abramov",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2022-11-10T15:05:44.985Z",
        publicationDate: "2022-11-10T15:05:44.985Z",
        availableResolutions: [Resolutions.P144, Resolutions.P240]
    },
    {
        id: 2,
        title: "Express video",
        author: "TJ Holowaychuk",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2022-11-10T15:05:44.985Z",
        publicationDate: "2022-11-10T15:05:44.985Z",
        availableResolutions: [Resolutions.P480, Resolutions.P240, Resolutions.P720]
    },
]

export const checkResolutions = (requestArray: Resolutions[]) => {
    const resolutions = [
        Resolutions.P144,
        Resolutions.P240,
        Resolutions.P360,
        Resolutions.P480,
        Resolutions.P720,
        Resolutions.P1080,
        Resolutions.P1440,
        Resolutions.P2160,
    ]

    if (requestArray.every(item => resolutions.includes(item))) {
        return true
    }

    return false
}

export const videoRoute = express.Router({})
export const testingRoute = express.Router({})

testingRoute.delete(`/all-data`, (req: Request, res: Response) => {
    videos = []
    res.sendStatus(204)
})

videoRoute.get(`/`, (req: Request, res: Response) => {
    res.status(200).send(videos)
})

videoRoute.get(`/:videoId`, (req: Request, res: Response) => {
    const videoId = +req.params.videoId
    const video: IVideo | undefined = videos.find(video => video.id === videoId)

    if (video) {
        return res.status(200).send(video)
    }

    res.sendStatus(404)
})

videoRoute.delete(`/testing/all-data`, (req: Request, res: Response) => {
    videos = []
    res.sendStatus(204)
})

videoRoute.delete(`/:videoId`, (req: Request, res: Response) => {
    const videoId = +req.params.videoId

    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === videoId) {
            videos.splice(i, 1)

            return res.sendStatus(204)
        }
    }

    res.sendStatus(404)
})

videoRoute.post(`/`, (req: Request, res: Response) => {
    const error = []

    if (!req.body.title) {
        error.push({
            message: "Title field not found",
            field: "title"
        })
    } else {
        if (req.body.title.length > 40) {
            error.push({
                message: "Title field length > 40 chars",
                field: "title"
            })
        }
    }

    if (!req.body.author) {
        error.push({
            message: "Author field not found",
            field: "author"
        })
    } else {
        if (req.body.author.length > 20) {
            error.push({
                message: "Author field length > 20 chars",
                field: "author"
            })
        }
    }

    if (!req.body.availableResolutions) {
        error.push({
            message: "availableResolutions field not found",
            field: "availableResolutions"
        })
    } else {
        const resStatus: boolean = checkResolutions(req.body.availableResolutions)

        if (!resStatus) {
            error.push({
                message: "availableResolutions should only include screen resolution options",
                field: "availableResolutions"
            })
        }
    }

    if (error.length > 0) {
        return res.status(400).send({
            errorsMessages: error
        })
    }

    const {title, author, availableResolutions} = req.body

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const video: IVideo = {
        id: +(new Date()),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: today.toISOString(),
        publicationDate: tomorrow.toISOString(),
        availableResolutions
    }

    // @ts-ignore
    videos.push(video)

    res.status(201).send(video)
})

videoRoute.put(`/:videoId`, (req: Request, res: Response) => {
    const error = []

    if (!req.body.title) {
        error.push({
            message: "Title field not found",
            field: "title"
        })
    } else {
        if (req.body.title.length > 40) {
            error.push({
                message: "Title field length > 40 chars",
                field: "title"
            })
        }
    }

    if (!req.body.author) {
        error.push({
            message: "Author field not found",
            field: "author"
        })
    } else {
        if (req.body.author.length > 20) {
            error.push({
                message: "Author field length > 20 chars",
                field: "author"
            })
        }
    }

    if (!req.body.availableResolutions) {
        error.push({
            message: "availableResolutions field not found",
            field: "availableResolutions"
        })
    }

    if (!req.body.canBeDownloaded) {
        error.push({
            message: "canBeDownloaded field not found",
            field: "canBeDownloaded"
        })
    } else {
        if (typeof req.body.canBeDownloaded !== "boolean") {
            error.push({
                message: "canBeDownloaded field must be boolean",
                field: "canBeDownloaded"
            })
        }
    }

    if (!req.body.minAgeRestriction) {
        error.push({
            message: "minAgeRestriction field not found",
            field: "minAgeRestriction"
        })
    } else {
        if (req.body.minAgeRestriction > 18) {
            error.push({
                message: "minAgeRestriction nums does not > 18",
                field: "minAgeRestriction"
            })
        } else if (req.body.minAgeRestriction < 1) {
            error.push({
                message: "minAgeRestriction nums does not < 1",
                field: "minAgeRestriction"
            })
        }
    }

    if (!req.body.publicationDate) {
        error.push({
            message: "publicationDate field not found",
            field: "publicationDate"
        })
    }

    if (error.length > 0) {
        return res.status(400).send({
            errorsMessages: error
        })
    }

    const videoId = +req.params.videoId
    const {
        title,
        author,
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate
    } = req.body

    const video: IVideo | undefined = videos.find(video => video.id === videoId)

    if (!video) {
        return res.sendStatus(404)
    }

    const videoIndex = videos.findIndex(video => video.id === videoId)
    videos[videoIndex] = {
        ...video,
        title,
        author,
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate
    }

    res.sendStatus(204)
})

videoRoute.delete("/__test__/delete", (req: Request, res: Response) => {
    videos = []
    res.sendStatus(204)
})