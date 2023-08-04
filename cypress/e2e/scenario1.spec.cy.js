describe('1st scenario', () => {
    let activeSectionsCount = 0;
    const sectionResults = {
      a: [],
      b: [],
      c: []
    };
  
    it('Should check and provide the results of the test statements', () => {
      cy.log('1. Navigate to the test page');
      cy.visit('https://my.laphil.com/en/syos2/package/1183');
      cy.url().should('be.equal', 'https://my.laphil.com/en/syos2/package/1183');
  
      cy.log('2. Add 2 standard seats');
      const checkInputValue = () => {
        return cy.get('input[type="number"]').then(($input) => {
          return parseInt($input.val());
        });
      };
  
    cy.get('input[type="number"]').then(($input) => {
        const targetValue = 2;
        let currentValue = parseInt($input.val());
  
        while (currentValue !== targetValue) {
          if (currentValue < targetValue) {
            cy.get('button[class="input-group-addon btn increment"]').click();
          } else if (currentValue > targetValue) {
            cy.get('button[class="input-group-addon btn decrement"]').click();
          }
  
          checkInputValue().then((newValue) => {
            currentValue = newValue;
          });
        }
      });
  
      cy.log('3. Check all sections');
      cy.get('div[class="syos-level-selector-price-types__item"]').each(($section) => {
        cy.wrap($section).within(() => {
          cy.get('div[class="syos-level-selector-price-types__item__contents"]').then(($contents) => {
            if ($contents.hasClass('sr-only')) {
              sectionResults.c.push($contents.text().trim());
            } else {
              cy.wrap($contents).click();
  
              activeSectionsCount++;
  
              cy.log('4. Click on the Continue button');
              cy.get('div[class="syos-level-selector-wrapper"]')
                .find('div[class="syos-level-selector-container__cta"]')
                .find('button[class="syos-button syos-level-selector__button"]')
                .contains('Continue')
                .click();//Somehow cypress can't see that button, so I can't reproduce this test
              
  
              cy.get('div[role=dialog]')
                .invoke('text')
                .then((text) => {
                  if (text.includes("We couldn't find 2 seats together. Please try again with a different quantity or in a different section.")) {
                    sectionResults.b.push($contents.text().trim());
                    console.log('This section has only 2 separate seats available');
                  }
                });
  
              cy.get('div[class="syos-basket__inner"]')
                .should('exist')
                .then(() => {
                  sectionResults.a.push($contents.text().trim());
                  console.log('There are 2 seats next to each other');
                });
            }
          });
        });
      });
  
      cy.log('Final Report:');
      cy.log(`How many sections were active? ${activeSectionsCount}`);
      cy.log(`What section met the requirement a.? ${sectionResults.a.join(', ')}`);
      cy.log(`What section met the requirement b.? ${sectionResults.b.join(', ')}`);
      cy.log(`What section met the requirement c.? ${sectionResults.c.join(', ')}`);
    });
  });
  