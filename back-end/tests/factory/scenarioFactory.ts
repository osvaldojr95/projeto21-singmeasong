import { prisma } from "../../src/database.js";
import recommendationFactory from "./recommendationFactory.js";

async function donwvoteScenario(vote: number) {
    const recomendation = await recommendationFactory.createRecommendation();
    return prisma.recommendation.update({
        where: { id: recomendation.id },
        data: { score: vote },
    });
}

async function getRecommendationsScenario() {
    for (let i = 0; i < 12; i++) {
        await recommendationFactory.createRecommendation();
    }
}

const scenarioFactory = {
    donwvoteScenario,
    getRecommendationsScenario,
};

export default scenarioFactory;
