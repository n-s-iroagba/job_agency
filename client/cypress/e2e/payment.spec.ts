/// <reference types="cypress" />

describe('Payment Flow', () => {
    beforeEach(() => {
        // Maps to STK-APP-AUTH-004
        // Log in as applicant using custom command
        cy.login('testuser@example.com', 'Password1!')
        // Navigate directly to a payment stage (assume application id 123)
        cy.visit('/dashboard/applications/123/apply')
        cy.contains('Proceed to Payment').click()
    })

    // Maps to STK-APP-PAY-002, STK-APP-PAY-003, STK-APP-PAY-004, DM-003, TRUST-003, TRUST-007
    // Screen: SCR-APP-PAYUPLOAD-001, SCR-APP-PAYSTATUS-001
    it('Uploads a valid payment screenshot and shows pending verification', () => {
        const fileName = 'payment.jpg'
        cy.fixture(fileName, 'base64').then(fileContent => {
            cy.get('input[type="file"]').attachFile({ fileContent, fileName, mimeType: 'image/jpeg' })
        })
        cy.get('button').contains('Submit Proof').click()
        cy.contains('Pending Verification').should('be.visible')
    })

    // Maps to STK-APP-PAY-003, NFR-SEC-005
    // Screen: SCR-APP-PAYUPLOAD-001
    it('Rejects invalid file type or oversized file', () => {
        const fileName = 'large.pdf'
        cy.fixture(fileName, 'base64').then(fileContent => {
            cy.get('input[type="file"]').attachFile({ fileContent, fileName, mimeType: 'application/pdf' })
        })
        cy.get('button').contains('Submit Proof').click()
        cy.contains('File type not allowed').should('be.visible')
    })

    // Maps to STK-APP-PAY-004, STK-APP-PAY-005, STK-ADM-PAY-001, STK-ADM-PAY-002, DM-003
    // Screen: SCR-APP-PAYSTATUS-001, SCR-ADM-UNVERIFIED-001
    it('Shows verified status after admin marks payment as paid (simulated via API)', () => {
        cy.request('POST', '/api/admin/payments/123/verify', { status: 'paid' })
        cy.reload()
        cy.contains('Verified').should('be.visible')
        cy.get('.toast').should('contain', 'Payment marked as Paid')
    })
})
