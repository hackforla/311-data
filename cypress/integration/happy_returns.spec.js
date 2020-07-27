describe('Working w/ JSON and REST', () => {

    it('Contact Us: Sending Email', () => {

        cy.server()
        cy.route({
            method: 'GET',
            url: '**/getProductVariants',
            json:true,
            onResponse(xhr) {
                expect(xhr.status).to.eq(200)
            }
        }).as('getProductVariants')

       cy.request('https://happyreturnsqatest.proxy.beeceptor.com/getProductVariants').then((response)=>{
           let bodyHr = JSON.stringify(response.body);
           cy.log(bodyHr)


           cy.request({
               method: 'POST',
               url: 'https://happyreturnsqatest.proxy.beeceptor.com/order',
               body: {
                   bodyHr
               }
           })
       })

    })


})
