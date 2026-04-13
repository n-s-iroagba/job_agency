/// <reference types="cypress" />

describe('Admin Crypto Wallet Management Flow', () => {
    beforeEach(() => {
        // Maps to NFR-SEC-004
        cy.login('admin@example.com', 'AdminPass1!')
        cy.visit('/admin/crypto-wallets')
    })

    // Maps to STK-ADM-CRYPTO-001, SCR-ADM-CRYPTO-001
    it('Displays the list of crypto wallets', () => {
        cy.get('table').should('be.visible')
    })

    // Maps to STK-ADM-CRYPTO-001, STK-ADM-CRYPTO-002, SCR-ADM-CRYPTOFORM-001
    it('Creates a new Crypto Wallet', () => {
        cy.contains('Add Wallet').click()
        cy.get('input[name="displayLabel"]').type('Bitcoin Main')
        cy.get('select[name="cryptoType"]').select('BTC')
        cy.get('input[name="network"]').type('Bitcoin Network')
        cy.get('input[name="walletAddress"]').type('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
        cy.get('button[type="submit"]').click()
        cy.contains('Bitcoin Main').should('be.visible')
    })

    // Maps to STK-ADM-CRYPTO-001, SCR-ADM-CRYPTO-001
    it('Updates an existing Crypto Wallet', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.get('button').contains('Edit').click()
        })
        cy.get('input[name="displayLabel"]').clear().type('BTC Main Updated')
        cy.get('button[type="submit"]').click()
        cy.contains('BTC Main Updated').should('be.visible')
    })

    // Maps to STK-ADM-CRYPTO-001, SCR-ADM-CRYPTO-001, NFR-DATA-001
    it('Deletes a Crypto Wallet', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.get('button').contains('Delete').click()
        })
        cy.get('button').contains('Confirm').click()
    })
})
