describe('2nd scenario', () => {
    it('Should select 2 seats from available and check info in checkout', () => {
        const eventUrl = 'https://my.laphil.com/en/syos2/package/1183';


    cy.log("1. Navigate to the site")
    cy.visit(eventUrl);
    cy.url().should("be.equal", "https://my.laphil.com/en/syos2/package/1183");
  
  
    cy.log("2. Select 'Any Best Available Seat', then click 'Continue'");
    cy.get('span[class="zone"]')
      .contains('Any Best Available Seat')
      .click();
  
    cy.get('button[class="syos-button syos-level-selector__button"]')
      .contains('Continue')
      .click();
  
    cy.log("3. Select one seat and click 'Confirm Seats'");
    //Because it's provide me 2 already selected seats, I will unselect one, according to requiremnets
    cy.get('button[class="syos-lineitem__remove"]').first().click();

    cy.get('.syos-basket__lineItems')
    .find('li')
    .should('have.length', 1);

    let rememberedText;
    let rememberedPrice;

    cy.get('button.syos-lineitem__title')
    .invoke('text')
    .then((text) => {
        rememberedText = text.trim().slice(-4);
      });


      cy.get('span.syos-price__value')
      .invoke('text')
      .then((price) => {
        rememberedPrice = price.trim();

    cy.get('button').contains('Confirm seats').click();

    cy.log("4. On the cart page: verify the quantity, price, and seat information is correct");
    cy.url().should("be.equal", "https://my.laphil.com/en/booking/basket");

    cy.log("Close popup");
    cy.get('a[id="targetDonationSkip"]').click();

    cy.log("Check if seat information is correct");
    cy.get('div.performance')
    .first()
    .invoke('text')
    .should((text) => {
      expect(text.trim()).to.include(rememberedText);
    });

    cy.log("Check if quantity is correct");
    cy.get('td[class="quantity"]').should('contain', '1');

    cy.log("Check if price is correct");
    cy.get('td.price')
    .invoke('text')
    .should((text) => {
      expect(text).to.include(rememberedPrice);
    
    });
  });
});
});