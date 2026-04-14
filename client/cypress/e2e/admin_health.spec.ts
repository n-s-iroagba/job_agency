/// <reference types="cypress" />

describe('Admin System Health View', () => {
    beforeEach(() => {
        window.localStorage.setItem('token', 'fake-admin-jwt');
        cy.intercept('GET', '**/telemetry', {
            statusCode: 200,
            body: {
                cpu: { usage: 14.2 },
                ram: { usage: 4.8 },
                uptime: { days: 42 },
                requests: { active: 1284 }
            }
        }).as('getHealth');
        cy.visit('/admin/health')
    })

    it('Displays system metrics correctly', () => {
        cy.wait('@getHealth')
        cy.contains('14.2').should('be.visible') // CPU usage mock
        cy.contains('1284').should('be.visible') // Active requests mock
        cy.contains('System Health').should('exist')
    })
})
