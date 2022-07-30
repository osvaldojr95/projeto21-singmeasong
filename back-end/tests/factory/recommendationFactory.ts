import { prisma } from "../../src/database.js";

function exampleRecommendation() {
    return {
        name: "Falamansa - Xote dos Milagres",
        youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };
}

async function createRecommendation(recomendation = exampleRecommendation()) {
    console.log(recomendation);
    const createdRecomendation = await prisma.recommendation.upsert({
        where: { name: recomendation.name },
        update: {},
        create: {
            name: recomendation.name,
            youtubeLink: recomendation.youtubeLink,
        },
    });

    setTimeout(() => {}, 500);

    return createdRecomendation;
}

async function getRecommendationById(id: number) {
    return prisma.recommendation.findFirst({
        where: { id },
    });
}

async function setVoteRecommendationById(id: number, vote: number) {
    return prisma.recommendation.update({
        where: { id },
        data: { score: vote },
    });
}

const recommendationFactory = {
    exampleRecommendation,
    createRecommendation,
    getRecommendationById,
    setVoteRecommendationById,
};

export default recommendationFactory;
