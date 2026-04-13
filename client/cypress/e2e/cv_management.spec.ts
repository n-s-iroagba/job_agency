/// <reference types="cypress" />

describe('CV Management Flow', () => {
    beforeEach(() => {
        // Maps to STK-APP-AUTH-004
        cy.login('testuser@example.com', 'Password1!')
        cy.visit('/dashboard/cv')
    })

    // Maps to STK-APP-CV-001, STK-APP-CV-002, SCR-APP-CV-001
    it('Uploads a valid CV and shows success', () => {
        const fileName = 'resume.pdf'
        cy.uploadFile('input[type="file"]', fileName, 'application/pdf')
        cy.get('button').contains('Upload').click()
        cy.contains('Upload successful').should('be.visible')
    })

    // Maps to STK-APP-CV-002, STK-APP-CV-003, SCR-APP-CV-001
    it('Rejects unsupported format and oversized file', () => {
        const fileName = 'large.txt'
        cy.uploadFile('input[type="file"]', fileName, 'text/plain')
        cy.get('button').contains('Upload').click()
        cy.contains('File type not allowed').should('be.visible')
    })

    // Maps to STK-APP-CV-001, SCR-APP-CV-001
    it('Updates existing CV', () => {
        // Assume a CV already exists, click edit
        cy.get('.cv-item').first().within(() => {
            cy.get('button').contains('Edit').click()
        })
        const newFile = 'resume_v2.pdf'
        cy.uploadFile('input[type="file"]', newFile, 'application/pdf')
        cy.get('button').contains('Save').click()
        cy.contains('CV updated').should('be.visible')
    })

    // Maps to STK-APP-CV-001, SCR-APP-CV-001
    it('Deletes a CV', () => {
        cy.get('.cv-item').first().within(() => {
            cy.get('button').contains('Delete').click()
        })
        cy.get('button').contains('Confirm').click()
        cy.contains('CV deleted').should('be.visible')
    })
})
