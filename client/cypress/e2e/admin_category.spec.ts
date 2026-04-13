/// <reference types="cypress" />

describe('Admin Category Management Flow', () => {
    beforeEach(() => {
        // Maps to NFR-SEC-004
        cy.login('admin@example.com', 'AdminPass1!')
        cy.visit('/admin/categories')
    })

    // Maps to STK-ADM-CAT-001, SCR-ADM-CAT-001
    it('Displays the list of categories', () => {
        cy.get('table').should('be.visible')
    })

    // Maps to STK-ADM-CAT-001, STK-ADM-CAT-002, SCR-ADM-CATFORM-001
    it('Creates a new Category', () => {
        cy.contains('Add Category').click()
        cy.get('input[name="name"]').type('Software Engineering')
        cy.get('textarea[name="description"]').type('Tech and Development roles')
        cy.get('button[type="submit"]').click()
        cy.contains('Software Engineering').should('be.visible')
    })

    // Maps to STK-ADM-CAT-001, SCR-ADM-CAT-001
    it('Updates an existing Category', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.get('button').contains('Edit').click()
        })
        cy.get('input[name="name"]').clear().type('Engineering & Tech')
        cy.get('button[type="submit"]').click()
        cy.contains('Engineering & Tech').should('be.visible')
    })

    // Maps to STK-ADM-CAT-001, SCR-ADM-CAT-001
    it('Deletes a Category', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.get('button').contains('Delete').click()
        })
        cy.get('button').contains('Confirm').click()
    })
})
