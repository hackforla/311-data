describe('311 Data', () => {

    const {_} = Cypress

    context('Explore My Council\'s 311 Data', () => {
        it('Map: Year-to-date, Dead Animal [DAN]', () => {

            cy.server()
            cy.route({
                method: 'POST',
                url: Cypress.env('devApiUrl') + '/map/clusters',
                onResponse(xhr) {
                    expect(xhr.status).to.eq(200)
                }
            }).as('getFilterList')

            cy.visit('/')
            cy.get('.navbar-end > :nth-child(1)').click()
            cy.get('.menu-tabs > :nth-child(1)').click()
            cy.get('.active').click()
            cy.get('.dropdown-trigger > .button').click()
            cy.get('[value="YEAR_TO_DATE"]').click()
            cy.get(':nth-child(2) > .select-group-content > .select-item > .select-item-box').click()
            cy.get('#checkbox-request-checkbox-all').click({force: true})
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

        it('Data Visualization: Year-to-date, Dead Animal [DAN]', () => {

            cy.server()
            cy.route({
                method: 'POST',
                url: Cypress.env('devApiUrl') + '/map/clusters',
                onResponse(xhr) {
                    expect(xhr.status).to.eq(200)
                }
            }).as('getFilterList')

            cy.visit('/')
            cy.get('.navbar-end > :nth-child(1)').click()
            cy.get('.menu-tabs > :nth-child(2)').click()
            cy.get('.dropdown-trigger > .button').click()
            cy.get('[value="YEAR_TO_DATE"]').click()
            cy.get(':nth-child(2) > .select-group-content > .select-item > .select-item-box').click()
            cy.get('#checkbox-request-checkbox-all').click({force: true})
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

    context('Compare Different Councils', () => {
        it('Comparison Filters', () => {
            cy.visit('/')
            cy.get('#navbar > div > div:nth-child(2)').click()
            cy.get('#date-selector-dropdown > .dropdown-trigger > .button').click()
            cy.get('[value="YEAR_TO_DATE"]').click()
            cy.get('.district-selector > :nth-child(1)').click()
            cy.get('#district-selector-dropdown > .dropdown-trigger > .button').click()
            cy.get('[value="nc"]').click()
            cy.get(':nth-child(2) > .select-group-content > .select-item > .select-item-box').click()
            cy.get('#btn-district-selector-submit').click()

            cy.get('.district-selector > :nth-child(3)').click()
            cy.get('#district-selector-dropdown > .dropdown-trigger > .button').click()
            cy.get('[value="cc"]').click()
            cy.get(':nth-child(2) > .select-item-box').click()
            cy.get('#btn-district-selector-submit').click()
            cy.get('.columns > :nth-child(1) > :nth-child(1) > label').click()
            cy.get('#type-selector-container > div > div:nth-child(1)  > div:nth-child(2) > span > input').click({force:true})
            cy.get('#btn-sidebar-submit-button').click()
            cy.get('.chartjs-render-monitor').then(($el) => {
                expect($el).to.exist
            })
        })
    })

    const serverId = '';

    const testEmail = `fake\@email.com`

    context('Contact Us', () => {
        it('Contact Us: Sending Email', () => {

            cy.server()
            cy.route({
                method:'POST',
                url: Cypress.env('devApiUrl') +'/feedback',
                response: [{"success": true}],
                onResponse(xhr) {
                    expect(xhr.status).to.eq(200);
                }
            }).as('feedbackJSON')

            cy.visit('/')
            cy.get('.navbar-end > :nth-child(4)').click()
            cy.get('#contact-firstname').type('Test')
            cy.get('#contact-lastname').type('User')
            cy.get('#contact-email').type(testEmail)
            cy.get('#contact-message').type('email test')
            cy.get('#btn-contact-submit').click()
            cy.wait('@feedbackJSON')

            cy.get('.contact-success-popup').should('exist')
        })

        it.skip('Contact Us: Checking email', () => {
            cy.mailosaurGetMessage(serverId, {
                sentTo: testEmail
            }).then(email => {
                expect(email.subject).to.equal('Thanks for your feedback');
            })
        })
    })

})
