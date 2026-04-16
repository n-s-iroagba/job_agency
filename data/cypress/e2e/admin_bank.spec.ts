/// <reference types="cypress" />

describe('Admin Bank Account Management Flow', () => {
    beforeEach(() => {
        window.localStorage.setItem('token', 'fake-admin-jwt');
        cy.intercept('GET', '**/admin/bank-accounts', {
            statusCode: 200,
            body: [
                { id: 1, bankName: 'HSBC Corporate', accountNumber: '****8920', accountType: 'Normal', currency: 'EUR', isActive: true },
            ]
        }).as('getBanks');
        cy.intercept('DELETE', '**/admin/bank-accounts/*', { statusCode: 200 }).as('deleteBank');

        cy.visit('/admin/bank-accounts')
    })

    it('Displays the list of bank accounts', () => {
        cy.wait('@getBanks')
        cy.contains('HSBC Corporate').should('be.visible')
    })

    it('Allows going to Add Bank Account page', () => {
        cy.contains('Add Bank Account').click()
        cy.url().should('include', '/admin/bank-accounts/new')
    })

    it('Deletes a Bank Account successfully', () => {
        cy.wait('@getBanks')
        cy.on('window:confirm', () => true);
        // Find raw click on icon if present
        cy.get('button').contains('delete_outline').click({ force: true });
        cy.wait('@deleteBank');
    })
})
