/// <reference types="cypress" />

describe('Application Payment Stage JS', () => {
    beforeEach(() => {
        window.localStorage.setItem('token', 'fake-applicant-jwt');
        cy.intercept('POST', '**/payments', {
            statusCode: 201,
            body: { success: true }
        }).as('uploadProof');
        cy.visit('/dashboard/applications/1')
    })

    it('Allows payment proof upload rendering', () => {
        cy.get('body').should('be.visible');
    })
})
