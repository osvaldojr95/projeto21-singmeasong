import { prisma } from "../../src/database.js";
import { faker } from "@faker-js/faker";

function exampleRecommendation() {
    return {
        name: faker.music.songName(),
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

const recommendationFactory = {
    exampleRecommendation,
    createRecommendation,
    getRecommendationById,
};

export default recommendationFactory;
