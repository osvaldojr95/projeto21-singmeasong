import { prisma } from "../../src/database.js";
import { faker } from "@faker-js/faker";
import recommendationFactory from "./recommendationFactory.js";

async function donwvoteScenario(vote: number) {
    const recomendation = await recommendationFactory.createRecommendation();
    return prisma.recommendation.update({
        where: { id: recomendation.id },
        data: { score: vote },
    });
}

async function getRecommendationsScenario(size = 12) {
    for (let i = 0; i < size; i++) {
        await recommendationFactory.createRecommendation();
    }
}

async function getRecommendationsAmout() {
    for (let i = 1; i < 5; i++) {
        const recommendation = recommendationFactory.exampleRecommendation();
        await prisma.recommendation.create({
            data: {
                name: recommendation.name,
                youtubeLink: recommendation.youtubeLink,
                score: i * 100,
            },
        });
    }
}

const scenarioFactory = {
    donwvoteScenario,
    getRecommendationsScenario,
    getRecommendationsAmout,
};

export default scenarioFactory;
