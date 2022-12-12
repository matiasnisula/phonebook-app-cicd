/* eslint-disable no-undef */
describe("Phonebook app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const person = {
      name: "Anssi",
      number: "123-456789",
    };
    cy.request("POST", "http://localhost:3003/api/persons/", person);
    cy.visit("http://localhost:3003");
  });

  it("front page can be opened", function () {
    cy.visit("http://localhost:3003");
    cy.contains("Phonebook");
    cy.contains("Add a new person");
    cy.contains("Numbers");
  });

  it("person can be added", function () {
    cy.get("#name-input").type("Eero");
    cy.get("#number-input").type("002-020202");
    cy.contains("add").click();
    cy.contains("Eero");
    cy.contains("002-020202");
  });
});
