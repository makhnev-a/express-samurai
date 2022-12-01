import request from "supertest"
import {app} from "../../index"
import {Resolutions} from "../../interfaces/video.interface";

describe("videoTests", () => {
    beforeAll(async () => {
        await request(app).delete("/api/videos/__test__/delete")
    })

    it("should return 200 and empty array", async () => {
        await request(app)
            .get("/api/videos")
            .expect(200, [])
    })

    it("should return 404 for not existing video", async () => {
        await request(app)
            .get("/api/videos/10")
            .expect(404)
    })

    it("should create new video", async () => {
        const ResArr = [
            Resolutions.P144,
            Resolutions.P240,
            Resolutions.P360,
            Resolutions.P480,
            Resolutions.P720,
            Resolutions.P1080,
            Resolutions.P1440,
            Resolutions.P2160
        ]

        const checkEnumArray = (arr: any) => {
            if (arr.every((item: Resolutions) => ResArr.includes(item))) {
                return arr
            }

            return []
        }

        const createResponse = await request(app)
            .post("/api/videos")
            .send({
                title: "New create title",
                author: "Makhnev Andrey",
                availableResolutions: [Resolutions.P144, Resolutions.P240]
            })
        const createVideo = createResponse.body
        console.log(createVideo.availableResolutions)
        let tt = checkEnumArray(createVideo.availableResolutions)

        expect(createVideo).toEqual({
            id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: expect(checkEnumArray(createVideo.availableResolutions)).not.toBe([])
        })
    })
})