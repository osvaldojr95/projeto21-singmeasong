import recommendationFactory from "./recommendationFactory.js";

async function donwvoteScenario(vote: number) {
    const recomendation = await recommendationFactory.createRecommendation();
    await recommendationFactory.setVoteRecommendationById(
        recomendation.id,
        vote
    );
    return recomendation;
}

const scenarioFactory = { donwvoteScenario };

export default scenarioFactory;
