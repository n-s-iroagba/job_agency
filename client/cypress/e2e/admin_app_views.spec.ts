/// <reference types="cypress" />

describe('Admin Application Views', () => {
    beforeEach(() => {
        window.localStorage.setItem('token', 'fake-admin-jwt');
        cy.intercept('GET', '**/admin/applicants/drafts', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Marcus Sterling', job: 'Senior UX Architect', completion: 85 }
            ]
        }).as('getDrafts');
        cy.visit('/admin/applicants/drafts')
    })

    it('Displays the drafts view perfectly', () => {
        cy.wait('@getDrafts')
        cy.contains('Marcus Sterling').should('be.visible')
        cy.contains('Senior UX Architect').should('be.visible')
    })
})
