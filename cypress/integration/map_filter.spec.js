describe('Filters Selection', () => {

    it('Map: Last Week, Dead Animal [DAN]', () => {

        cy.server()
        cy.route({
            method: 'POST',
            url: '/map/clusters',
            onResponse(xhr) {
                expect(xhr.status).to.eq(200)
            }
        }).as('getFilterList')

        cy.visit('/')
        cy.get('#root > header > div.navbar-brand > a').click()
        cy.get('#root > div > div.menu-container > div.menu-tabs > a:nth-child(1)').click()
        cy.get('.dropdown-trigger > .button').click()
        cy.get('[value="LAST_WEEK"]').click()
        cy.get(':nth-child(2) > .select-group-content > .select-item > .select-item-box').click()
        cy.get('#type-selector-container > div.columns.is-0 > div:nth-child(1) > div:nth-child(2) > span > input').click({force: true})
        cy.get('#btn-sidebar-submit-button').click()

        cy.wait('@getFilterList').should((xhr) => {
            const myCount = xhr.responseBody[0].count
            cy.get('#root > div.body.menu-is-open > div.map-container > div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > div > div > span').should('have.text', myCount)
        })

    })

    it('Data Visualization: Last Week, Dead Animal [DAN]', () => {

        cy.server()
        cy.route({
            method: 'POST',
            url: '/map/clusters',
            onResponse(xhr) {
                expect(xhr.status).to.eq(200)
            }
        }).as('getFilterList')

        cy.visit('/')
        cy.get('#root > header > div.navbar-brand > a').click()
        cy.get('#root > div > div.menu-container > div.menu-tabs > a:nth-child(2)').click()
        cy.get('.dropdown-trigger > .button').click()
        cy.get('[value="LAST_WEEK"]').click()
        cy.get(':nth-child(2) > .select-group-content > .select-item > .select-item-box').click()
        cy.get('#type-selector-container > div.columns.is-0 > div:nth-child(1) > div:nth-child(2) > span > input').click({force: true})
        cy.get('#btn-sidebar-submit-button').click()

        cy.wait('@getFilterList').should((xhr) => {
            const myCount = xhr.responseBody[0].count
            cy.get('.requests-box').should('have.text', myCount)
        })

    })

})

