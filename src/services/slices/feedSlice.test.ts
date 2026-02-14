import feedSlice, {
  getFeeds,
  initialState
} from './feedSlice';
import { expect, test, describe } from '@jest/globals';

describe('Тестирование редьюсера feedSlice', () => {
  describe('Тестирование экшена getFeeds.pending', () => {
    test('Должен установить loading в true и очистить ошибку при pending', () => {
      const action = { type: getFeeds.pending.type };
      const newState = feedSlice(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.orders).toEqual([]);
      expect(newState.total).toBe(0);
      expect(newState.totalToday).toBe(0);
    });

    test('Должен сохранить существующие данные при повторной загрузке', () => {
      const mockOrders = [
        {
          _id: '1',
          status: 'done',
          name: 'Бургер 1',
          createdAt: '2026-02-14',
          updatedAt: '2026-02-14',
          number: 123,
          ingredients: ['ing1', 'ing2']
        }
      ];

      const stateWithData = {
        orders: mockOrders,
        total: 100,
        totalToday: 10,
        loading: false,
        error: null
      };

      const action = { type: getFeeds.pending.type };
      const newState = feedSlice(stateWithData, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.orders).toEqual(mockOrders);
      expect(newState.total).toBe(100);
      expect(newState.totalToday).toBe(10);
    });
  });

  describe('Тестирование экшена getFeeds.fulfilled', () => {
    const mockOrders = [
      {
        _id: '1',
        status: 'done',
        name: 'Бургер 1',
        createdAt: '2026-02-14',
        updatedAt: '2026-02-14',
        number: 123,
        ingredients: ['ing1', 'ing2']
      },
      {
        _id: '2',
        status: 'pending',
        name: 'Бургер 2',
        createdAt: '2026-02-14',
        updatedAt: '2026-02-14',
        number: 456,
        ingredients: ['ing3', 'ing4']
      }
    ];

    const mockPayload = {
      orders: mockOrders,
      total: 150,
      totalToday: 25
    };

    test('Должен обновить состояние данными с сервера и установить loading в false', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: mockPayload
      };
      const newState = feedSlice(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.orders).toEqual(mockOrders);
      expect(newState.total).toBe(150);
      expect(newState.totalToday).toBe(25);
    });

    test('Должен заменить существующие данные новыми', () => {
      const oldOrders = [
        {
          _id: 'old',
          status: 'done',
          name: 'Старый бургер',
          createdAt: '2026-02-14',
          updatedAt: '2026-02-14',
          number: 999,
          ingredients: ['old1']
        }
      ];

      const stateWithOldData = {
        orders: oldOrders,
        total: 50,
        totalToday: 5,
        loading: true,
        error: null
      };

      const action = {
        type: getFeeds.fulfilled.type,
        payload: mockPayload
      };
      const newState = feedSlice(stateWithOldData, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.orders).toEqual(mockOrders);
      expect(newState.total).toBe(150);
      expect(newState.totalToday).toBe(25);
    });

    test('Должен обработать пустой массив заказов', () => {
      const emptyPayload = {
        orders: [],
        total: 0,
        totalToday: 0
      };

      const action = {
        type: getFeeds.fulfilled.type,
        payload: emptyPayload
      };
      const newState = feedSlice(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.orders).toEqual([]);
      expect(newState.total).toBe(0);
      expect(newState.totalToday).toBe(0);
    });
  });

  describe('Тестирование экшена getFeeds.rejected', () => {
    test('Должен установить ошибку и loading в false при rejected', () => {
      const errorMessage = 'Ошибка загрузки ленты';
      const action = {
        type: getFeeds.rejected.type,
        error: { message: errorMessage }
      };
      const newState = feedSlice(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.orders).toEqual([]);
      expect(newState.total).toBe(0);
      expect(newState.totalToday).toBe(0);
    });

    test('Должен сохранить существующие данные при ошибке', () => {
      const mockOrders = [
        {
          _id: '1',
          status: 'done',
          name: 'Бургер 1',
          createdAt: '2026-02-14',
          updatedAt: '2026-02-14',
          number: 123,
          ingredients: ['ing1', 'ing2']
        }
      ];

      const stateWithData = {
        orders: mockOrders,
        total: 100,
        totalToday: 10,
        loading: true,
        error: null
      };

      const errorMessage = 'Ошибка сети';
      const action = {
        type: getFeeds.rejected.type,
        error: { message: errorMessage }
      };
      const newState = feedSlice(stateWithData, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.orders).toEqual(mockOrders);
      expect(newState.total).toBe(100);
      expect(newState.totalToday).toBe(10);
    });

    test('Должен обработать ошибку без сообщения', () => {
      const action = {
        type: getFeeds.rejected.type,
        error: {}
      };
      const newState = feedSlice(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeUndefined();
    });
  });

  describe('Тестирование начального состояния', () => {
    test('Должен возвращать начальное состояние при неизвестном экшене', () => {
      const newState = feedSlice(initialState, { type: 'unknown' });
      expect(newState).toEqual(initialState);
    });

    test('Начальное состояние должно иметь корректные значения', () => {
      expect(initialState).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      });
    });
  });
});