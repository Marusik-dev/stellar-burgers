const bun = '[data-cy="1"]';
const anotherBun = '[data-cy="8"]';
const main = '[data-cy="7"]';
const sauce = '[data-cy="4"]';
const constructorBurgerConstructor = '[data-cy="burgerConstructor"]';
const modal = '[data-cy="modal"]';
const modalClose = '[data-cy="modalClose"]';
const modalCloseOverlay = '[data-cy="modalCloseOverlay"]';
const submitOrderButton = '[data-cy="order-button"]';
const submitOrderNumber = '[data-cy="order-number"]';

beforeEach(() => {
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
  cy.intercept('POST', 'api/auth/login', { fixture: 'login.json' }).as('login');
  cy.intercept('POST', 'api/auth/token', { fixture: 'login.json' });
  cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
    'createOrder'
  );
  window.localStorage.setItem(
    'refreshToken',
    JSON.stringify('fakeRefreshToken')
  );
  cy.setCookie('fakeAccessToken', 'fakeAccessToken');
  cy.visit('/');
  cy.viewport(1680, 1024);
  cy.wait('@getIngredients');
});

afterEach(() => {
  window.localStorage.clear();
  cy.clearCookies();
});

const verifyBunIngredients = (
  topBun: string,
  middleMain: string,
  bottomBun: string
) => {
  cy.get(constructorBurgerConstructor).should('contain', topBun);
  cy.get(constructorBurgerConstructor).should('contain', middleMain);
  cy.get(constructorBurgerConstructor).should('contain', bottomBun);
};

describe('Добавление ингредиента', () => {
  it('Проверка счетчика', () => {
    cy.get(main).children('button').click();
    cy.get(main).find('.counter__num').contains('1');
  });

  describe('Добавление булок и начинок', () => {
    it('Добавление булки и начинки', () => {
      cy.get(bun).children('button').click();
      cy.get(main).children('button').click();
      verifyBunIngredients(
        'Краторная булка N-200i',
        'Говяжий метеорит (отбивная)',
        'Краторная булка N-200i'
      );
    });

    it('Добавление булки и начинки + соус', () => {
      cy.get(bun).children('button').click();
      cy.get(main).children('button').click();
      cy.get(sauce).children('button').click();
      cy.get(constructorBurgerConstructor).should('contain', 'Соус Spicy-X');
      verifyBunIngredients(
        'Краторная булка N-200i',
        'Говяжий метеорит (отбивная)',
        'Краторная булка N-200i'
      );
    });

    it('Добавление булки после добавления начинок', () => {
      cy.get(main).children('button').click();
      cy.get(bun).children('button').click();
      verifyBunIngredients(
        'Краторная булка N-200i',
        'Говяжий метеорит (отбивная)',
        'Краторная булка N-200i'
      );
    });

    describe('Замена булок', () => {
      it('Замена булки другой булкой без начинок', () => {
        cy.get(bun).children('button').click();
        verifyBunIngredients(
          'Краторная булка N-200i',
          '',
          'Краторная булка N-200i'
        );
        cy.get(anotherBun).children('button').click();
        verifyBunIngredients(
          'Флюоресцентная булка R2-D3',
          '',
          'Флюоресцентная булка R2-D3'
        );
      });

      it('Замена булки другой булкой с начинками', () => {
        cy.get(bun).children('button').click();
        verifyBunIngredients(
          'Краторная булка N-200i',
          '',
          'Краторная булка N-200i'
        );
        cy.get(main).children('button').click();
        cy.get(anotherBun).children('button').click();
        verifyBunIngredients(
          'Флюоресцентная булка R2-D3',
          'Говяжий метеорит (отбивная)',
          'Флюоресцентная булка R2-D3'
        );
      });
    });
  });

  describe('Модальные окна', () => {
    it('Открытие модального окна', () => {
      cy.get(bun).click();
      cy.get(modal).should('be.visible');
    });
    it('Закрытие модального окна по крестику', () => {
      cy.get(main).click();
      cy.get(modal).should('be.visible');
      cy.get(modalClose).click();
      cy.get(modal).should('not.exist');
    });
    it('Закрытие модального окна по клику на оверлей', () => {
      cy.get(anotherBun).click();
      cy.get(modal).should('be.visible');
      cy.get(modalCloseOverlay).click({ force: true });
      cy.get(modal).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('Создает заказ и проверяет пустоту конструктора после закрытия модального окна', () => {
      cy.get(bun).children('button').click();
      cy.get(main).children('button').click();
      verifyBunIngredients(
        'Краторная булка N-200i',
        'Говяжий метеорит (отбивная)',
        'Краторная булка N-200i'
      );
      cy.get(submitOrderButton).click();
      cy.get(modal).should('be.visible');
      cy.get(submitOrderNumber).should('contain', '1');
      cy.get(modalClose).click();
      cy.get(modal).should('not.exist');

      cy.get(constructorBurgerConstructor).should('exist');
      cy.get(constructorBurgerConstructor).should(
        'not.contain',
        'Краторная булка N-200i'
      );
      cy.get(constructorBurgerConstructor).should(
        'not.contain',
        'Говяжий метеорит (отбивная)'
      );
    });
  });
});