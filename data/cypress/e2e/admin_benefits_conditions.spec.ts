/// <reference types="cypress" />

describe('Admin Benefits and Conditions configuration', () => {
    beforeEach(() => {
        window.localStorage.setItem('token', 'fake-admin-jwt');
        cy.intercept('GET', '**/admin/benefits', {
            statusCode: 200,
            body: [
                { id: 1, type: 'Health', description: 'Full Medical', value: '100% Coverage' }
            ]
        }).as('getBenefits');

        cy.intercept('GET', '**/admin/conditions', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Background Check', description: 'Federal check required' }
            ]
        }).as('getConditions');
    })

    it('Displays benefits properly', () => {
        cy.visit('/admin/benefits')
        cy.wait('@getBenefits')
        cy.contains('Health').should('be.visible')
    })

    it('Displays conditions properly', () => {
        cy.visit('/admin/conditions')
        cy.wait('@getConditions')
        cy.contains('Background Check').should('be.visible')
    })
})
