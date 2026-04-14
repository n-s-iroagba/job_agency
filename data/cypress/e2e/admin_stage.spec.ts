/// <reference types="cypress" />

describe('Admin Job Stage Builder', () => {
    beforeEach(() => {
        window.localStorage.setItem('token', 'fake-admin-jwt');
        cy.intercept('GET', '**/admin/jobs/*/stages', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Portfolio Review', orderPosition: 1, requiresPayment: true, amount: 50.0 }
            ]
        }).as('getStages');
        cy.visit('/admin/jobs/1/stages')
    })

    it('Displays stage configuration', () => {
        cy.wait('@getStages')
        cy.contains('Portfolio Review').should('be.visible')
    })
})
