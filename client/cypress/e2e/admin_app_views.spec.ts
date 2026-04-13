/// <reference types="cypress" />

describe('Admin Application Views & Communication Flow', () => {
    beforeEach(() => {
        // Maps to NFR-SEC-004
        cy.login('admin@example.com', 'AdminPass1!')
    })

    // Maps to STK-ADM-APP-001, SCR-ADM-NEWAPPS-001, NFR-PERF-004
    it('Displays the list of new completed applications', () => {
        cy.visit('/admin/applications/new')
        cy.get('table').should('be.visible')
        cy.get('table').contains('New Applications').should('exist')
    })

    // Maps to STK-ADM-APP-002, SCR-ADM-DRAFTS-001, NFR-PERF-004
    it('Displays the list of draft applications', () => {
        cy.visit('/admin/applications/drafts')
        cy.get('table').should('be.visible')
        cy.get('table').contains('Drafts').should('exist')
    })

    // Maps to STK-ADM-APP-003, STK-ADM-APP-004, SCR-ADM-MAIL-001, TRUST-008
    it('Composes and sends mail to an applicant', () => {
        cy.visit('/admin/mail/compose')
        cy.get('input[name="applicantSearch"]').type('john.doe@example.com')
        cy.get('input[name="subject"]').type('Interview Scheduling')
        cy.get('textarea[name="body"]').type('We would like to invite you...')
        cy.get('input[name="sendPush"]').check()

        cy.intercept('POST', '/api/admin/mail').as('sendMail')
        cy.get('button[type="submit"]').contains('Send').click()
        cy.wait('@sendMail').its('response.statusCode').should('eq', 200)
        cy.contains('Mail sent successfully').should('be.visible')
    })
})
