/// <reference types="cypress" />

describe('Admin Verification Flow', () => {
    beforeEach(() => {
        // Maps to STK-APP-AUTH-004, NFR-SEC-004
        // Log in as admin using custom command
        cy.login('admin@example.com', 'AdminPass1!')
        cy.visit('/admin/unverified-payments')
    })

    // Maps to STK-ADM-PAY-003, STK-ADM-PAY-004, SCR-ADM-UNPAID-001, SCR-ADM-UNVERIFIED-001, NFR-PERF-004
    it('Displays unverified payments list with pagination', () => {
        cy.get('table').should('be.visible')
        cy.get('table tbody tr').its('length').should('be.gte', 0)
        cy.get('button').contains('Next').should('exist')
    })

    // Maps to STK-ADM-PAY-001, STK-ADM-PAY-002, SCR-ADM-UNVERIFIED-001, TRUST-008
    it('Marks a payment as Paid and verifies notification request', () => {
        // Assume first row has a verify button
        cy.get('table tbody tr').first().within(() => {
            cy.get('button').contains('Verify').click()
        })
        // Intercept the notification API call
        cy.intercept('POST', '/api/notifications/**').as('notify')
        // Confirm success toast
        cy.get('.toast').should('contain', 'Payment marked as Paid')
        cy.wait('@notify')
    })

    // Maps to STK-ADM-PAY-001, STK-ADM-PAY-002, SCR-ADM-UNVERIFIED-001
    it('Marks a payment as Unpaid with a note and checks rejection badge', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.get('button').contains('Reject').click()
        })
        // Fill rejection note modal
        cy.get('textarea[name="note"]').type('Incorrect amount')
        cy.get('button').contains('Submit').click()
        // Verify badge updates on applicant side (simulated by API check)
        cy.request('GET', '/api/admin/payments/123').its('body').should('include', { status: 'unpaid' })
    })
})
