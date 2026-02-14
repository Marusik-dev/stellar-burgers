import reducer, { initialState, getIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';
import { describe, test } from '@jest/globals';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Соус фирменный Space Sauce',
    type: 'sauce',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0946',
    name: 'Хрустящие минеральные кольца',
    type: 'main',
    proteins: 808,
    fat: 689,
    carbohydrates: 609,
    calories: 986,
    price: 300,
    image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
    image_mobile:
      'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/mineral_rings-large.png'
  }
];
describe('Тест асинхронных экшенов', () => {
  const expectedResult = mockIngredients;

  test('Тест загрузки ингредиентов', async () => {
    const state = reducer(
      initialState,
      getIngredients.fulfilled(expectedResult, 'fulfilled')
    );
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(expectedResult);
  });

  test('Тест сообщения ошибки при rejected', async () => {
    const state = reducer(
      initialState,
      getIngredients.rejected(new Error('error'), 'rejected')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('error');
  });

  test('Тест состояния загрузи при pending', async () => {
    const state = reducer(initialState, getIngredients.pending('pending'));
    expect(state.loading).toBe(true);
  });
});