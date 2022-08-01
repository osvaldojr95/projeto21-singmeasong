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

    it("Get top recommendations", async () => {
        cy.visit(URL)
        cy.intercept("GET", `${URL}/recommendations/top/10`).as(
            "getRecommendations"
        )
        cy.get("#top").click()
        cy.wait("@getRecommendations").then(({ response }) => {
            expect(response.statusCode).equal(200)
        })
    })

    it("Get random recommendation", async () => {
        cy.visit(URL)
        cy.intercept("GET", `${URL}/recommendations/random`).as(
            "randomRecommendations"
        )
        cy.get("#random").click()
        cy.wait("@randomRecommendations").then(({ response }) => {
            expect(response.statusCode).equal(200)
        })
    })
})