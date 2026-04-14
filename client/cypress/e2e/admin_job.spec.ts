/// <reference types="cypress" />

describe('Admin Job Listings Management', () => {
    beforeEach(() => {
        window.localStorage.setItem('token', 'fake-admin-jwt');
        cy.intercept('GET', '**/admin/jobs', {
            statusCode: 200,
            body: [
                { id: 1, title: 'Senior UX Architect', location: 'London, UK OR Remote', status: 'Active' }
            ]
        }).as('getJobs');
        cy.visit('/admin/jobs')
    })

    it('Displays job listings correctly', () => {
        cy.wait('@getJobs')
        cy.contains('Senior UX Architect').should('be.visible')
    })

    it('Allows navigating to create new job', () => {
        cy.contains('Post New Job', { matchCase: false }).should('exist') // The UI uses "Post New Job"
    })
})
