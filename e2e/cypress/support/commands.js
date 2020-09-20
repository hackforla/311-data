// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import '@testing-library/cypress/add-commands'
//import 'cypress-mailosaur'

Cypress.Commands.add('format_number_with_K', (value) => {
    if (value > 9999) {
        return ((value / 1000).toFixed(0)) + "K"
    } else {
        return ((value / 1000).toFixed(1)) + "K"
    }
})

Cypress.Commands.add('format_number_with_comma', (value) => {
    return value.toLocaleString()
})
