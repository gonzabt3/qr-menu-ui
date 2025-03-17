describe('template spec', () => {
  describe('main', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit('http://localhost:3001')
    })
  
    it('displays the correct subscription texts', () => {
      // Wait for the content to load

      // Increase the timeout for this test
      cy.contains('Crea el menu QR').should('be.visible')

      // Assert that the text "Suscribite por mes y manejalo vos mismo" is present
      cy.contains('Suscribite por mes y manejalo vos mismo').should('be.visible')
    })
  }) 
})