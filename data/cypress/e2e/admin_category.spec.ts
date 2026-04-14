/// <reference types="cypress" />

describe('Admin Category Management Flow', () => {
    beforeEach(() => {
        window.localStorage.setItem('token', 'fake-admin-jwt');
        cy.intercept('GET', '**/admin/categories', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Engineering & Technology', description: 'Tech jobs' },
            ]
        }).as('getCategories');
        cy.visit('/admin/categories')
    })

    it('Displays the categories on the dashboard', () => {
        cy.wait('@getCategories')
        cy.contains('Engineering & Technology').should('be.visible')
    })

    it('Allows adding a new category', () => {
        cy.contains('Create Category').click({ force: true })
        cy.url().should('include', '/admin/categories/new')
    })
})
