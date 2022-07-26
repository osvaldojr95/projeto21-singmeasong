import app from "../src/app.js";
import supertest from "supertest";
import { prisma } from "../src/database.js";
import {
    exampleRecommendation,
    createRecommendation,
} from "./factory/recommendationFactory.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

describe("POST /recommendations", () => {
    it("New recommendation", async () => {
        const tryRecommendation = await supertest(app)
            .post("/recommendations")
            .send(exampleRecommendation);
        expect(tryRecommendation.status).toEqual(201);
    });

    it("Recommendation without name", async () => {
        const recommendation = exampleRecommendation();
        delete recommendation.name;
        const tryRecommendation = await supertest(app)
            .post("/recommendations")
            .send(recommendation);
        expect(tryRecommendation.status).toEqual(422);
    });

    it("Recommendation without link", async () => {
        const recommendation = exampleRecommendation();
        delete recommendation.youtubeLink;
        const tryRecommendation = await supertest(app)
            .post("/recommendations")
            .send(recommendation);
        expect(tryRecommendation.status).toEqual(422);
    });

    it("Recommendation wrong link", async () => {
        const recommendation = exampleRecommendation();
        recommendation.youtubeLink =
            "https://www.facebook.com/watch?v=chwyjJbcs1Y";
        const tryRecommendation = await supertest(app)
            .post("/recommendations")
            .send(recommendation);
        expect(tryRecommendation.status).toEqual(422);
    });
});

describe("POST /recommendations/:id/upvote", () => {
    it("Upvote recomendations", async () => {
        const recomendation = await createRecommendation(
            exampleRecommendation()
        );
        const tryRecommendation = await supertest(app).post(
            `/recommendations/${recomendation.id}/upvote`
        );
        expect(tryRecommendation.status).toEqual(200);
    });

    it("non-existent id", async () => {
        const tryRecommendation = await supertest(app).post(
            `/recommendations/1/upvote`
        );
        expect(tryRecommendation.status).toEqual(404);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});
