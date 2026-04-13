/// <reference types="cypress" />

describe('Payment Flow', () => {
    beforeEach(() => {
        // Log in as applicant
        cy.visit('/login')
        cy.get('input[name="email"]').type('testuser@example.com')
        cy.get('input[name="password"]').type('Password1!')
        cy.get('button[type="submit"]').click()
        cy.url().should('include', '/dashboard')
        // Navigate directly to a payment stage (assume stage 2 of application 123)
        cy.visit('/dashboard/applications/123/apply')
        cy.contains('Proceed to Payment').click()
    })

    it('Uploads valid payment screenshot and shows pending verification', () => {
        // Mock file upload using cypress-file-upload plugin (assumed installed)
        const fileName = 'payment.jpg'
        cy.fixture(fileName, 'base64').then(fileContent => {
            cy.get('input[type="file"]').attachFile({ fileContent, fileName, mimeType: 'image/jpeg' })
        })
        cy.get('button').contains('Submit Proof').click()
        cy.contains('Pending Verification').should('be.visible')
    })

    it('Rejects invalid file type or oversized file', () => {
        const fileName = 'large.pdf'
        cy.fixture(fileName, 'base64').then(fileContent => {
            cy.get('input[type="file"]').attachFile({ fileContent, fileName, mimeType: 'application/pdf' })
        })
        cy.get('button').contains('Submit Proof').click()
        cy.contains('File type not allowed').should('be.visible')
    })

    it('Shows verified status after admin marks payment as paid (simulated via API)', () => {
        // Simulate admin action by calling backend endpoint directly
        cy.request('POST', '/api/admin/payments/123/verify', { status: 'paid' })
        // Refresh page to see updated status
        cy.reload()
        cy.contains('Verified').should('be.visible')
        cy.get('.toast').should('contain', 'Payment marked as Paid')
    })
})
