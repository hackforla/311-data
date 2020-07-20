
describe('Filter Selection', () => {

  it('Map: Last Week, Dead Animal [DAN]', () => {
    cy.visit('/')
    cy.get('#root > header > div.navbar-brand > a').click()
    cy.get('#root > div > div.menu-container > div.menu-tabs > a:nth-child(1)').click()
    cy.get('.dropdown-trigger > .button').click()
    cy.get('[value="LAST_WEEK"]').click()
    cy.get(':nth-child(2) > .select-group-content > .select-item > .select-item-box').click()
    cy.get('#type-selector-container > div.columns.is-0 > div:nth-child(1) > div:nth-child(2) > span > input').click({force: true})
    cy.get('#btn-sidebar-submit-button').click()
    cy.get('#icon-request-icon-DAN').should("exist");
  });

  it('Data Visualization: Last Week, Dead Animal [DAN]', () => {
    cy.visit('/')
    cy.get('#root > header > div.navbar-brand > a').click()
    cy.get('#root > div > div.menu-container > div.menu-tabs > a:nth-child(2)').click()
    cy.get('.dropdown-trigger > .button').click()
    cy.get('[value="LAST_WEEK"]').click()
    cy.get(':nth-child(2) > .select-group-content > .select-item > .select-item-box').click()
    cy.get('#type-selector-container > div.columns.is-0 > div:nth-child(1) > div:nth-child(2) > span > input').click({force: true})
    cy.get('#btn-sidebar-submit-button').click()
    cy.get('#icon-request-icon-DAN').should("exist");
  });

})

