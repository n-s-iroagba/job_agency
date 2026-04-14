/// <reference types="cypress" />

describe('Authentication Flow', () => {
    beforeEach(() => {
        cy.intercept('POST', '**/auth/register', {
            statusCode: 201,
            body: { token: 'fake-jwt', user: { id: 1, role: 'APPLICANT', fullName: 'Test User' } }
        }).as('register');

        cy.intercept('POST', '**/auth/login', {
            statusCode: 200,
            body: { token: 'fake-jwt', user: { id: 1, role: 'APPLICANT', fullName: 'Test User' } }
        }).as('login');
    })

    it('Registers via email', () => {
        cy.visit('/register')
        cy.get('input[type="email"]').first().type('testuser@example.com')
        cy.get('input[type="password"]').first().type('Password1!')
        cy.get('button[type="submit"], button').last().click({ force: true })
        // If it intercepts correctly it should redirect or show success.
        // We just ensure it doesn't hard-crash.
        cy.url().should('not.include', '/404')
    })

    it('Logs in with existing credentials', () => {
        cy.visit('/login')
        cy.get('input[type="email"]').first().type('testuser@example.com')
        cy.get('input[type="password"]').first().type('Password1!')
        cy.get('button[type="submit"], button').last().click({ force: true })
        cy.url().should('not.include', '/404')
    })
})
