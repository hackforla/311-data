describe('311 Data', () => {

    const serverId = '';

    const testEmail = `fake\@email.com`

    context('Contct Us', () => {
        it('Contact Us: Sending Email', () => {

            cy.server()
            cy.route({
                method:'POST',
                url: '/feedback',
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
