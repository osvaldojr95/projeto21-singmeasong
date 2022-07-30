import app from "../src/app.js";
import supertest from "supertest";
import { prisma } from "../src/database.js";
import recommendationFactory from "./factory/recommendationFactory.js";
import scenarioFactory from "./factory/scenarioFactory.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

describe("POST /recommendations", () => {
    it("New recommendation", async () => {
        const tryRecommendation = await supertest(app)
            .post("/recommendations")
            .send(recommendationFactory.exampleRecommendation());
        expect(tryRecommendation.status).toEqual(201);
    });

    it("Recommendation without name", async () => {
        const recommendation = recommendationFactory.exampleRecommendation();
        delete recommendation.name;
        const tryRecommendation = await supertest(app)
            .post("/recommendations")
            .send(recommendation);
        expect(tryRecommendation.status).toEqual(422);
    });

    it("Recommendation without link", async () => {
        const recommendation = recommendationFactory.exampleRecommendation();
        delete recommendation.youtubeLink;
        const tryRecommendation = await supertest(app)
            .post("/recommendations")
            .send(recommendation);
        expect(tryRecommendation.status).toEqual(422);
    });

    it("Recommendation wrong link", async () => {
        const recommendation = recommendationFactory.exampleRecommendation();
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
        const recomendation =
            await recommendationFactory.createRecommendation();
        const tryRecommendation = await supertest(app).post(
            `/recommendations/${recomendation.id}/upvote`
        );
        const recomendationUpdated =
            recommendationFactory.getRecommendationById(recomendation.id);
        expect((await recomendationUpdated).score).toEqual(1);
    });

    it("non-existent id", async () => {
        const tryRecommendation = await supertest(app).post(
            `/recommendations/1/upvote`
        );
        expect(tryRecommendation.status).toEqual(404);
    });
});

describe("POST /recommendations/:id/donwvote", () => {
    it("Downvote recomendations", async () => {
        let score = 5;
        const recomendation = await scenarioFactory.donwvoteScenario(score);
        await supertest(app).post(
            `/recommendations/${recomendation.id}/downvote`
        );
        const recomendationUpdated =
            await recommendationFactory.getRecommendationById(recomendation.id);
        expect(recomendationUpdated.score).toEqual(score - 1);
    });

    it("non-existent id", async () => {
        const tryRecommendation = await supertest(app).post(
            `/recommendations/1/downvote`
        );
        expect(tryRecommendation.status).toEqual(404);
    });
});

describe("GET /recommendations", () => {
    it("Verify last 10 recommendations", async () => {
        await scenarioFactory.getRecommendationsScenario();
        const getRecommendations = await supertest(app).get(`/recommendations`);
        console.log(getRecommendations.body);
        expect(getRecommendations.body).toHaveLength(10);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});
