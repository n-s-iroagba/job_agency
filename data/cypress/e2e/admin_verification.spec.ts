/// <reference types="cypress" />

describe('Admin Verification Queues', () => {
    beforeEach(() => {
        window.localStorage.setItem('token', 'fake-admin-jwt');
        cy.intercept('GET', '**/admin/payments/unverified', {
            statusCode: 200,
            body: [
                { id: 1, amount: 50.00, currency: 'USD', status: 'Unverified', application: { id: 101, user: { fullName: 'Elena Vance' } } }
            ]
        }).as('getUnverified');
    })

    it('Displays unverified payments correctly', () => {
        cy.visit('/admin/payments/unverified')
        cy.wait('@getUnverified')
        cy.contains('50').should('be.visible')
    })
})
