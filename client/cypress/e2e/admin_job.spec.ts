/// <reference types="cypress" />

describe('Admin Job Listing Management Flow', () => {
    beforeEach(() => {
        // Maps to NFR-SEC-004
        cy.login('admin@example.com', 'AdminPass1!')
        cy.visit('/admin/jobs')
    })

    // Maps to STK-ADM-JOB-001, STK-ADM-JOB-004, SCR-ADM-JOB-001, NFR-PERF-004
    it('Displays the list of job listings', () => {
        cy.get('table').should('be.visible')
    })

    // Maps to STK-ADM-JOB-001, STK-ADM-JOB-002, STK-ADM-JOB-003, STK-ADM-JOB-005, SCR-ADM-JOBFORM-001
    it('Creates a new Job Listing', () => {
        cy.contains('Add Job').click()
        cy.get('input[name="title"]').type('Software Engineer')
        cy.get('textarea[name="description"]').type('We are looking for a passionate developer.')
        cy.get('input[name="location"]').type('Remote')
        cy.get('select[name="employmentType"]').select('Full-Time')
        // Assumes category with index 1 exists
        cy.get('select[name="category"]').select(1)
        cy.get('textarea[name="requirements"]').type('5+ years of experience via TypeScript/React.')
        cy.get('input[name="active"]').check()
        cy.get('button[type="submit"]').click()
        cy.contains('Software Engineer').should('be.visible')
    })

    // Maps to STK-ADM-JOB-001, SCR-ADM-JOB-001
    it('Updates an existing Job Listing', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.get('button').contains('Edit').click()
        })
        cy.get('input[name="title"]').clear().type('Senior Software Engineer')
        cy.get('button[type="submit"]').click()
        cy.contains('Senior Software Engineer').should('be.visible')
    })

    // Maps to STK-ADM-JOB-001, STK-ADM-JOB-005, SCR-ADM-JOB-001
    it('Toggles Job Listing Activity', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.get('input[type="checkbox"]').click()
        })
        // UI should reflect status toggle (e.g. from Active to Inactive or vice-versa)
    })

    // Maps to STK-ADM-JOB-001, SCR-ADM-JOB-001
    it('Deletes a Job Listing', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.get('button').contains('Delete').click()
        })
        cy.get('button').contains('Confirm').click()
    })
})
