describe('Contact Us', () => {

    const serverId = 'eq9vw94r';
    const testEmail = `test_user.${serverId}@mailosaur.io`

    it.skip('Contact Us: Sending Email', () => {
        cy.visit('/')
        cy.get(':nth-child(3) > a').click()
        cy.get('#contact-firstname').type('Test')
        cy.get('#contact-lastname').type('User')
        cy.get('#contact-email').type(testEmail)
        cy.get('#contact-message').type('email test')
        cy.get('#btn-contact-submit').click()

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
