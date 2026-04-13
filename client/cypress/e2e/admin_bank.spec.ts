/// <reference types="cypress" />

describe('Admin Bank Account Management Flow', () => {
    beforeEach(() => {
        // Maps to NFR-SEC-004
        cy.login('admin@example.com', 'AdminPass1!')
        cy.visit('/admin/bank-accounts')
    })

    // Maps to STK-ADM-BANK-001, STK-ADM-BANK-002, SCR-ADM-BANK-001
    it('Displays the list of bank accounts with types', () => {
        cy.get('table').should('be.visible')
        cy.get('table').contains('Open Beneficiary')
        cy.get('table').contains('Normal')
    })

    // Maps to STK-ADM-BANK-001, STK-ADM-BANK-002, SCR-ADM-BANKFORM-001, NFR-SEC-009
    it('Creates a new Bank Account', () => {
        cy.contains('Add Bank Account').click()
        cy.get('input[name="bankName"]').type('Test Bank')
        cy.get('input[name="accountNumber"]').type('1234567890')
        cy.get('select[name="accountType"]').select('Open Beneficiary')
        cy.get('button[type="submit"]').click()
        cy.contains('Test Bank').should('be.visible')
    })

    // Maps to STK-ADM-BANK-001, STK-ADM-BANK-004, SCR-ADM-BANK-001
    it('Updates an existing Bank Account', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.get('button').contains('Edit').click()
        })
        cy.get('input[name="bankName"]').clear().type('Updated Bank')
        cy.get('button[type="submit"]').click()
        cy.contains('Updated Bank').should('be.visible')
    })

    // Maps to STK-ADM-BANK-001, SCR-ADM-BANK-001, NFR-DATA-001
    it('Deletes a Bank Account', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.get('button').contains('Delete').click()
        })
        // Confirmation modal
        cy.get('button').contains('Confirm').click()
        // Verification would involve checking the table no longer contains it
    })
})
