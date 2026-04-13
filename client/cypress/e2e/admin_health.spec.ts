/// <reference types="cypress" />

describe('Admin System Health Monitoring Flow', () => {
    beforeEach(() => {
        // Maps to NFR-SEC-004
        cy.login('admin@example.com', 'AdminPass1!')
    })

    // Maps to STK-ADM-HEALTH-001, STK-ADM-HEALTH-002, SCR-ADM-HEALTH-001, NFR-OBS-004
    it('Displays the System Health Dashboard with real-time metrics', () => {
        cy.visit('/admin/health')

        // Server Health assertions
        cy.contains('Server Health').should('be.visible')
        cy.contains('CPU').should('exist')
        cy.contains('Memory').should('exist')
        cy.contains('Uptime').should('exist')

        // Database Health assertions
        cy.contains('Database Health').should('be.visible')
        cy.contains('Connection Pool').should('exist')
        cy.contains('Query Latency').should('exist')
    })

    // Maps to STK-ADM-HEALTH-003, NFR-OBS-004
    it('Verifies health check endpoints respond within 500ms', () => {
        cy.request({
            method: 'GET',
            url: '/api/health',
            timeout: 500 // Map to 500ms latency requirement
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.duration).to.be.lessThan(500)
        })
    })
})
