/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject = any> {
        /** Custom command to log in a user */
        login(email: string, password: string): Chainable<void>
        /** Custom command to upload a file */
        uploadFile(selector: string, fileName: string, mimeType: string): Chainable<void>
    }
}

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/login')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
})

Cypress.Commands.add('uploadFile', (selector: string, fileName: string, mimeType: string) => {
    cy.fixture(fileName, 'base64').then(fileContent => {
        cy.get(selector).attachFile({ fileContent, fileName, mimeType })
    })
})
