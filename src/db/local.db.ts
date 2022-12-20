import {Resolutions} from "../interfaces/video.interface";
import {blogCollection, postCollection, userCollection} from "./mongoDb";

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

export const clearDb = async () => {
    await postCollection.deleteMany({})
    await blogCollection.deleteMany({})
    await userCollection.deleteMany({})
}