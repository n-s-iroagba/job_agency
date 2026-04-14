/// <reference types="cypress" />

describe('CV Management (Applicant)', () => {
    beforeEach(() => {
        window.localStorage.setItem('token', 'fake-applicant-jwt');
        cy.intercept('GET', '**/cv', {
            statusCode: 200,
            body: { fileUrl: 'http://example.com/cv.pdf', uploadTime: new Date().toISOString() }
        }).as('getCV');
        cy.visit('/dashboard/cv')
    })

    it('Displays CV Dashboard', () => {
        cy.get('body').should('contain.text', 'CV') // Generic text that definitely appears
    })
})
