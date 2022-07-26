import { prisma } from "../../src/database.js";

export function exampleRecommendation() {
    return {
        name: "Falamansa - Xote dos Milagres",
        youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };
}

export async function createRecommendation(recomendation: any) {
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
