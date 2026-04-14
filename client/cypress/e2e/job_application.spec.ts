/// <reference types="cypress" />

describe('Job Application (Applicant)', () => {
    beforeEach(() => {
        window.localStorage.setItem('token', 'fake-applicant-jwt');
        cy.intercept('GET', '**/applications/1', {
            statusCode: 200,
            body: { id: 1, jobId: 1, currentStageId: 101, status: 'Active', completionPercentage: 50, job: { title: 'Senior UX Architect' } }
        }).as('getApp');
        cy.visit('/dashboard/applications/1')
    })

    it('Displays Application Progress', () => {
        cy.get('body').should('be.visible')
    })
})
