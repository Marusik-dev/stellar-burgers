import reducer, { initialState, getOrderByNumber } from './orderSlice';
import { TOrder } from '@utils-types';
import { describe, test, expect } from '@jest/globals';
import { TOrderResponse } from '@api';

const mockOrder: TOrder = {
  _id: '12345',
  status: 'done',
  name: 'Test Order',
  createdAt: '2026-02-14T00:00:00Z',
  updatedAt: '2026-02-14T00:00:00Z',
  number: 1,
  ingredients: ['ingredient1', 'ingredient2']
};

const mockOrderResponse: TOrderResponse = {
  success: true,
  orders: [mockOrder]
};

describe('Тест асинхронных экшенов заказа', () => {
  test('Тест состояния загрузки заказа по номеру', async () => {
    let state = reducer(initialState, getOrderByNumber.pending('pending', 1));
    expect(state.request).toBe(true);
    expect(state.getOrderByNumberResponse).toBe(null);
    expect(state.error).toBe(null);

    state = reducer(
      state,
      getOrderByNumber.fulfilled(mockOrderResponse, 'fulfilled', 1)
    );
    expect(state.request).toBe(false);
    expect(state.getOrderByNumberResponse).toEqual(mockOrder);
    expect(state.error).toBe(null);
  });

  test('Тест сообщения ошибки при rejected', async () => {
    const state = reducer(
      initialState,
      getOrderByNumber.rejected(new Error('error'), 'rejected', 1)
    );
    expect(state.request).toBe(false);
    expect(state.getOrderByNumberResponse).toBe(null);
    expect(state.error).toBe('error');
  });
});