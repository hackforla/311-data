describe('Working w/ JSON and REST', () => {

    it.skip('JSON Response', () => {

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

    it('Google Search', ()=> {
        cy.visit('http://www.google.com')
        cy.get('#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input').type('Happy Returns')
        cy.get('#tsf > div:nth-child(2) > div.A8SBwf.emcav > div.UUbT9 > div.aajZCb > div.tfB0Bf > center > input.gNO89b').click()
        cy.get('#rso > div:nth-child(1) > div > div > div.r > a').should('contain.text', 'Happy Returns')
    })

})
