import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import recommendationFactory from "../factory/recommendationFactory";

describe("recommendationService", () => {
    it("Create recommendation", async () => {
        const recommendation = recommendationFactory.exampleRecommendation();
        jest.spyOn(
            recommendationRepository,
            "findByName"
        ).mockImplementationOnce((): any => {});
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(
            (): any => {}
        );
        await recommendationService.insert(recommendation);
        expect(recommendationRepository.create).toHaveBeenCalled();
    });

    it("Try create with exist name", async () => {
        const recommendation = recommendationFactory.exampleRecommendation();
        jest.spyOn(
            recommendationRepository,
            "findByName"
        ).mockImplementationOnce((): any => {
            return {
                id: 1,
                ...recommendation,
                score: 0,
            };
        });
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(
            (): any => {}
        );
        const tryCreate = recommendationService.insert(recommendation);
        expect(tryCreate).rejects.toEqual({
            type: "conflict",
            message: "Recommendations names must be unique",
        });
    });

    it("Upvote recommendation", async () => {
        const recommendation = {
            id: 1,
            ...recommendationFactory.exampleRecommendation(),
        };
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return {
                    ...recommendation,
                    score: 0,
                };
            }
        );
        jest.spyOn(
            recommendationRepository,
            "updateScore"
        ).mockImplementationOnce((): any => {});
        await recommendationService.upvote(recommendation.id);
        expect(recommendationRepository.find).toHaveBeenCalled();
        expect(recommendationRepository.updateScore).toHaveBeenCalled();
    });

    it("Upvote non-exist recommendation", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return null;
            }
        );
        const tryUp = recommendationService.upvote(5);
        expect(tryUp).rejects.toEqual({ type: "not_found", message: "" });
    });

    it("Downvote recommendation", async () => {
        const recommendation = {
            id: 1,
            ...recommendationFactory.exampleRecommendation(),
            score: 3,
        };
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return {
                    ...recommendation,
                };
            }
        );
        jest.spyOn(
            recommendationRepository,
            "updateScore"
        ).mockImplementationOnce((): any => {
            return {
                ...recommendation,
            };
        });
        await recommendationService.downvote(recommendation.id);
        expect(recommendationRepository.find).toHaveBeenCalled();
        expect(recommendationRepository.updateScore).toHaveBeenCalled();
    });

    it("Downvote recommendation with score = -5", async () => {
        const recommendation = {
            id: 1,
            ...recommendationFactory.exampleRecommendation(),
        };
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return {
                    ...recommendation,
                };
            }
        );
        jest.spyOn(
            recommendationRepository,
            "updateScore"
        ).mockImplementationOnce((): any => {
            return {
                ...recommendation,
                score: -6,
            };
        });
        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce(
            (): any => {}
        );
        await recommendationService.downvote(recommendation.id);
        expect(recommendationRepository.find).toHaveBeenCalled();
        expect(recommendationRepository.updateScore).toHaveBeenCalled();
        expect(recommendationRepository.remove).toHaveBeenCalled();
    });

    it("Downvote non-exist recommendation", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return null;
            }
        );
        const tryDown = recommendationService.downvote(5);
        expect(tryDown).rejects.toEqual({ type: "not_found", message: "" });
    });

    it("Get by ID", async () => {
        const recommendation = {
            id: 1,
            ...recommendationFactory.exampleRecommendation(),
        };
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(
            (): any => {
                return {
                    ...recommendation,
                };
            }
        );
        const seachRecommendation = await recommendationService.getById(
            recommendation.id
        );
        expect(recommendationRepository.find).toHaveBeenCalled();
        expect(seachRecommendation.name).toEqual(recommendation.name);
    });

    it("Get all recommendations", async () => {
        const recommendations = [];
        const size = 5;
        for (let i = 0; i < size; i++) {
            recommendations.push({
                id: i + 1,
                ...recommendationFactory.exampleRecommendation(),
            });
        }

        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [...recommendations];
            }
        );
        const seachAllRecommendations = await recommendationService.get();
        expect(recommendationRepository.findAll).toHaveBeenCalled();
        expect(seachAllRecommendations).toHaveLength(size);
    });

    it("Get top recommendations", async () => {
        jest.spyOn(
            recommendationRepository,
            "getAmountByScore"
        ).mockImplementationOnce((): any => {});
        await recommendationService.getTop(1);
        expect(recommendationRepository.getAmountByScore).toHaveBeenCalled();
    });

    it("Get random recommendation with score > 10", async () => {
        const recommendations = [];
        const recommendation = {
            ...recommendationFactory.exampleRecommendation(),
            score: 11,
        };
        for (let i = 0; i < 5; i++) {
            recommendations.push({ ...recommendation });
        }
        const random = 0.1;
        jest.spyOn(global.Math, "random").mockReturnValue(random);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [...recommendations];
            }
        );
        const randomRecommendation = await recommendationService.getRandom();
        expect(randomRecommendation).toEqual(recommendation);
    });

    it("Get random recommendation with score between -5 and 10", async () => {
        const recommendations = [];
        const recommendation = {
            ...recommendationFactory.exampleRecommendation(),
            score: 11,
        };
        for (let i = 0; i < 5; i++) {
            recommendations.push({ ...recommendation });
        }
        const random = 0.8;
        jest.spyOn(global.Math, "random").mockReturnValue(random);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [...recommendations];
            }
        );
        const randomRecommendation = await recommendationService.getRandom();
        expect(randomRecommendation).toEqual(recommendation);
    });

    it("Get random recommendation with no filter", async () => {
        const recommendations = [];
        const recommendation = {
            ...recommendationFactory.exampleRecommendation(),
            score: 11,
        };
        for (let i = 0; i < 5; i++) {
            recommendations.push({ ...recommendation });
        }
        const random = 0.8;
        jest.spyOn(global.Math, "random").mockReturnValue(random);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [];
            }
        );
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [...recommendations];
            }
        );
        const randomRecommendation = await recommendationService.getRandom();
        expect(randomRecommendation).toEqual(recommendation);
    });

    it("Not get a random recommendation", async () => {
        const random = 0.8;
        jest.spyOn(global.Math, "random").mockReturnValue(random);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [];
            }
        );
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(
            (): any => {
                return [];
            }
        );
        const randomRecommendation = recommendationService.getRandom();
        expect(randomRecommendation).rejects.toEqual({
            type: "not_found",
            message: "",
        });
    });
});
