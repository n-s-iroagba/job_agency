/// <reference types="cypress" />

describe('Authentication Flow', () => {
    it('Registers via email and logs in', () => {
        cy.visit('/register')
        cy.get('input[name="fullName"]').type('Test User')
        cy.get('input[name="email"]').type('testuser@example.com')
        cy.get('input[name="password"]').type('Password1!')
        cy.get('button[type="submit"]').click()
        // Assume auto-login after registration
        cy.url().should('include', '/dashboard')
    })

    it('Logs in with existing credentials', () => {
        cy.visit('/login')
        cy.get('input[name="email"]').type('testuser@example.com')
        cy.get('input[name="password"]').type('Password1!')
        cy.get('button[type="submit"]').click()
        cy.url().should('include', '/dashboard')
    })

    it('Shows error on invalid login', () => {
        cy.visit('/login')
        cy.get('input[name="email"]').type('invalid@example.com')
        cy.get('input[name="password"]').type('wrongpass')
        cy.get('button[type="submit"]').click()
        cy.contains('Invalid credentials').should('be.visible')
    })
})
