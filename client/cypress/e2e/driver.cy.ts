// client/cypress/e2e/driver.cy.js

const faker = require('faker');

// changed
const driverEmail = faker.internet.email();
const driverFirstName = faker.name.firstName();
const driverLastName = faker.name.lastName();
const riderEmail = faker.internet.email();
const riderFirstName = faker.name.firstName();
const riderLastName = faker.name.lastName();

describe('The driver dashboard', function () {
  it('Cannot be visited if the user is not a driver', function () {
    cy.intercept('POST', 'log_in').as('logIn');

    // new
    cy.addUser(riderEmail, riderFirstName, riderLastName, 'rider');

    // Log in.
    cy.visit('/#/log-in');
    cy.get('input#username').type(riderEmail); // changed
    cy.get('input#password').type('pAssw0rd', { log: false });
    cy.get('button').contains('Log in').click();
    cy.hash().should('eq', '#/');
    cy.get('button').contains('Log out');
    cy.wait('@logIn');

    cy.visit('/#/driver');
    cy.hash().should('eq', '#/');
  });

  it('Can be visited if the user is a driver', function () {
    cy.intercept('POST', 'log_in').as('logIn');

    // new
    cy.addUser(driverEmail, driverFirstName, driverLastName, 'driver');

    // Log in.
    cy.visit('/#/log-in');
    cy.get('input#username').type(driverEmail); // changed
    cy.get('input#password').type('pAssw0rd', { log: false });
    cy.get('button').contains('Log in').click();
    cy.hash().should('eq', '#/');
    cy.get('button').contains('Log out');
    cy.wait('@logIn');

    cy.visit('/#/driver');
    cy.hash().should('eq', '#/driver');
  });
});
