/// <reference types="cypress" />

describe('Admin Benefits & Conditions Management', () => {
    beforeEach(() => {
        // Maps to NFR-SEC-004
        cy.login('admin@example.com', 'AdminPass1!')
    })

    // Benefits Tests
    describe('Benefits', () => {
        beforeEach(() => {
            cy.visit('/admin/benefits')
        })

        // Maps to STK-ADM-BEN-001, STK-ADM-BEN-004, SCR-ADM-BEN-001
        it('Displays the list of benefits', () => {
            cy.get('table').should('be.visible')
        })

        // Maps to STK-ADM-BEN-001, STK-ADM-BEN-002, SCR-ADM-BENFORM-001
        it('Creates a new Benefit', () => {
            cy.contains('Add Benefit').click()
            cy.get('select[name="benefitType"]').select('Health Insurance')
            cy.get('input[name="description"]').type('Full family coverage')
            cy.get('button[type="submit"]').click()
            cy.contains('Full family coverage').should('be.visible')
        })

        // Maps to STK-ADM-BEN-001, SCR-ADM-BEN-001
        it('Deletes a Benefit', () => {
            cy.get('table tbody tr').first().within(() => {
                cy.get('button').contains('Delete').click()
            })
            cy.get('button').contains('Confirm').click()
        })
    })

    // Conditions Tests
    describe('Conditions', () => {
        beforeEach(() => {
            cy.visit('/admin/conditions')
        })

        // Maps to STK-ADM-COND-001, STK-ADM-COND-003, SCR-ADM-COND-001
        it('Displays the list of conditions', () => {
            cy.get('table').should('be.visible')
        })

        // Maps to STK-ADM-COND-001, STK-ADM-COND-002, SCR-ADM-CONDFORM-001
        it('Creates a new Condition', () => {
            cy.contains('Add Condition').click()
            cy.get('input[name="name"]').type('Background Check')
            cy.get('textarea[name="description"]').type('Must pass clear criminal background check.')
            cy.get('button[type="submit"]').click()
            cy.contains('Background Check').should('be.visible')
        })

        // Maps to STK-ADM-COND-001, SCR-ADM-COND-001
        it('Deletes a Condition', () => {
            cy.get('table tbody tr').first().within(() => {
                cy.get('button').contains('Delete').click()
            })
            cy.get('button').contains('Confirm').click()
        })
    })
})
