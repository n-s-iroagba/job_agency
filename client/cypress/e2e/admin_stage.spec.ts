/// <reference types="cypress" />

describe('Admin Application Stage Management Flow', () => {
    beforeEach(() => {
        // Maps to NFR-SEC-004
        cy.login('admin@example.com', 'AdminPass1!')
        // Navigating to stages for job ID 1
        cy.visit('/admin/jobs/1/stages')
    })

    // Maps to STK-ADM-STAGE-001, STK-ADM-STAGE-005, SCR-ADM-STAGE-001
    it('Displays the list of application stages for a job', () => {
        cy.get('ul').should('be.visible')
        cy.contains('Stage').should('exist')
    })

    // Maps to STK-ADM-STAGE-001, STK-ADM-STAGE-002, STK-ADM-STAGE-003, STK-ADM-STAGE-004, SCR-ADM-STAGEFORM-001
    it('Creates a new Application Stage', () => {
        cy.contains('Add Stage').click()
        cy.get('input[name="name"]').type('Background Check')
        cy.get('textarea[name="description"]').type('External verification.')
        cy.get('input[name="requiresPayment"]').check()
        cy.get('input[name="amount"]').type('100.00')
        cy.get('select[name="currency"]').select('USD')
        cy.get('input[name="notifyEmail"]').check()
        cy.get('button[type="submit"]').click()
        cy.contains('Background Check').should('be.visible')
        cy.contains('Payment Required: $100.00 USD').should('exist')
    })

    // Maps to STK-ADM-STAGE-001, SCR-ADM-STAGE-001
    it('Deletes an Application Stage', () => {
        cy.get('ul li').first().within(() => {
            cy.get('button').contains('Delete').click()
        })
        cy.get('button').contains('Confirm').click()
    })
})
