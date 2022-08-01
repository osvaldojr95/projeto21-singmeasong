/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

const URL = "http://localhost:5000"

describe("User flow", () => {

    it("Post a recommendation", async () => {
        const recommendation = {
            name: faker.name.findName(),
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }
        cy.visit(URL)
        cy.get("#name").type(recommendation.name)
        cy.get("#url").type(recommendation.youtubeLink)
        cy.intercept("POST", `${URL}/recommendations`).as(
            "createRecommendation"
        )
        cy.get("#send").click()
        cy.wait("@createRecommendation").then(({ response }) => {
            expect(response.statusCode).equal(201)
        })
    })
})