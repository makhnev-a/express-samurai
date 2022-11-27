import {IBlog} from "../interfaces/blog.interface";
import {Resolutions} from "../interfaces/video.interface";
import {IPost} from "../interfaces/post.interface";

export let blogs: IBlog[] = [
    {
        id: "12345",
        name: "Blog 1",
        description: "blog1 descr",
        websiteUrl: "http://blog1.ru"
    },
    {
        id: "22345",
        name: "Blog 2",
        description: "blog2 descr",
        websiteUrl: "http://blog2.ru"
    },
    {
        id: "33345",
        name: "Blog 3",
        description: "blog3 descr",
        websiteUrl: "http://blog3.ru"
    },
]

export let posts: IPost[] = [
    {
        id: "post123",
        title: "post 1 title",
        shortDescription: "post descr short 1",
        content: "lorem10lorem10lorem10lorem10lorem10",
        blogId: "12345",
        blogName: "Blog 1",
    },
    {
        id: "post456",
        title: "post 2 title",
        shortDescription: "post descr short 2",
        content: "lorem10lorem10lorem10lorem10lorem22",
        blogId: "12345",
        blogName: "Blog 1",
    },
    {
        id: "post789",
        title: "post 3 title",
        shortDescription: "post descr short 3",
        content: "lorem10lorem10lorem10lorem10lorem33",
        blogId: "22345",
        blogName: "Blog 2",
    },
]

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

export const clearDb = () => {
    blogs = []
    posts = []
    videos = []
}