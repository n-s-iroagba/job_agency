/// <reference types="cypress" />

describe('Job Application Flow', () => {
    beforeEach(() => {
        // Maps to STK-APP-AUTH-002, STK-APP-AUTH-005
        // Ensure user is logged in using a custom command
        cy.login('testuser@example.com', 'Password1!')
    })

    // Maps to STK-APP-AUTH-001, STK-APP-AUTH-003, STK-ADM-JOB-004, STK-APP-APPLY-001, DM-004, TRUST-009
    // Screen: SCR-PUB-HOME-001, SCR-APP-JOBDETAIL-002, SCR-APP-JOBAPPLY-001
    it('Browses jobs and starts an application', () => {
        cy.visit('/')
        cy.contains('Job Listings').should('be.visible')
        // Click the first job's Apply Now button
        cy.get('button').contains('Apply Now').first().click()
        // Should be redirected to the application page for that job
        cy.url().should('match', /\/dashboard\/applications\/\d+\/apply/)
        cy.contains('Application Stage').should('be.visible')
    })

    // Maps to STK-APP-APPLY-002, STK-APP-APPLY-003, STK-APP-APPLY-005, DM-001, DM-005, DM-007, TRUST-005
    // Screen: SCR-APP-JOBAPPLY-001, SCR-APP-PAYMENT-001
    it('Completes non‑payment stages and verifies progress tracker', () => {
        // Directly navigate to a known application (replace 123 with a real id in real run)
        cy.visit('/dashboard/applications/123/apply')
        // Complete Stage 1 (Document Review) – example form fields
        cy.get('form').within(() => {
            cy.get('input[name="firstName"]').type('John')
            cy.get('input[name="lastName"]').type('Doe')
            cy.get('button[type="submit"]').click()
        })
        // Verify tracker shows stage 1 completed
        cy.get('.progress-tracker').contains('Stage 1').should('have.class', 'completed')

        // Proceed to Stage 2 (Payment) – click the button that leads to payment page
        cy.contains('Proceed to Payment').click()
        // Verify correct bank account type is displayed for amount < $4,999
        // Maps to STK-APP-PAY-001, STK-ADM-BANK-002, STK-ADM-BANK-003
        cy.get('.bank-details').should('contain', 'Open Beneficiary')
    })
})
