describe('Filters Selection', () => {

    const {_} = Cypress

    it.skip('Map: Last Week, Dead Animal [DAN]', () => {

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
        cy.get('[value="LAST_12_MONTHS"]').click()
        cy.get(':nth-child(2) > .select-group-content > .select-item > .select-item-box').click()
        cy.get('#type-selector-container > div.columns.is-0 > div:nth-child(1) > div:nth-child(2) > span > input').click({force: true})
        cy.get('#btn-sidebar-submit-button').click()

        cy.wait('@getFilterList').should((xhr) => {
            _.each(xhr.response.body, function (value, index) {
                const nthChild = index + 1
                const bubbleLocator = '#root > div.body.menu-is-open > div.map-container > div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > div:nth-child(' + nthChild + ') > div > span'

                if (value.count > 999) {
                    cy.format_number_with_K(value.count).then((formatted_value) => {
                        cy.get(bubbleLocator).should('have.text', formatted_value)
                    })
                } else {
                    cy.get(bubbleLocator).should('have.text', value.count)
                }

            })
        })
    })

    it.skip('Data Visualization: Last Week, Dead Animal [DAN]', () => {

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
        cy.get('[value="LAST_12_MONTHS"]').click()
        cy.get(':nth-child(2) > .select-group-content > .select-item > .select-item-box').click()
        cy.get('#type-selector-container > div.columns.is-0 > div:nth-child(1) > div:nth-child(2) > span > input').click({force: true})
        cy.get('#btn-sidebar-submit-button').click()

        cy.wait('@getFilterList').should((xhr) => {
            let requestsCount = 0
            _.each(xhr.response.body, function (value) {
                requestsCount += value.count
            })

            cy.format_number_with_comma(requestsCount).then((formatted_value) => {
                cy.get('.requests-box').should('have.text', formatted_value)
            })

        })

    })

})

