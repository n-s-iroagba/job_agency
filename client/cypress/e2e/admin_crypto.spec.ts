/// <reference types="cypress" />

describe('Admin Crypto Wallets Management', () => {
    beforeEach(() => {
        window.localStorage.setItem('token', 'fake-admin-jwt');
        cy.intercept('GET', '**/admin/crypto-wallets', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Main Treasury USDT', network: 'Ethereum', address: '0x123', status: 'Active' },
            ]
        }).as('getWallets');
        cy.visit('/admin/crypto-wallets')
    })

    it('Displays crypto wallets on the dashboard', () => {
        cy.wait('@getWallets')
        cy.contains('Main Treasury USDT').should('be.visible')
    })

    it('Navigates to the Add Wallet page', () => {
        cy.contains('Add Wallet').click({ force: true })
        cy.url().should('include', '/admin/crypto-wallets/new')
    })
})
