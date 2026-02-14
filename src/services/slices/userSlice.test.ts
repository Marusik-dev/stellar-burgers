import reducer, {
  initialState,
  getRegisterUser,
  getLoginUser,
  getUser,
  updateUser,
  getLogoutUser,
  getOrders
} from './userSlice';
import { TOrder, TUser } from '@utils-types';
import { describe, test, expect } from '@jest/globals';
import { TRegisterData, TLoginData, TUserResponse } from '@api';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockOrders: TOrder[] = [
  {
    _id: '12345',
    status: 'done',
    name: 'Order 1',
    createdAt: '2026-02-14T00:00:00Z',
    updatedAt: '2026-02-14T00:00:00Z',
    number: 1,
    ingredients: ['ingredient1', 'ingredient2']
  }
];

const mockRegisterData: TRegisterData = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

const mockLoginData: TLoginData = {
  email: 'test@example.com',
  password: 'password123'
};

const mockRegisterResponse = {
  success: true,
  user: mockUser,
  accessToken: 'accessToken',
  refreshToken: 'refreshToken'
};

const mockLoginResponse = {
  success: true,
  user: mockUser,
  accessToken: 'accessToken',
  refreshToken: 'refreshToken'
};

const mockUserResponse = {
  success: true,
  user: mockUser
};

const mockOrdersResponse = mockOrders;

describe('Тесты для userSlice', () => {
  test('Тест состояния при регистрации пользователя (pending, fulfilled, rejected)', () => {
    // Тест pending
    let state = reducer(
      initialState,
      getRegisterUser.pending('requestId', mockRegisterData)
    );
    expect(state.request).toBe(true);
    expect(state.error).toBe(null);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(false);

    // Тест fulfilled
    state = reducer(
      state,
      getRegisterUser.fulfilled(
        mockRegisterResponse,
        'requestId',
        mockRegisterData
      )
    );
    expect(state.request).toBe(false);
    expect(state.error).toBe(null);
    expect(state.response).toEqual(mockUser);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(true);

    state = reducer(
      state,
      getRegisterUser.rejected(
        new Error('error'),
        'requestId',
        mockRegisterData
      )
    );
    expect(state.request).toBe(false);
    expect(state.error).toBe('error');
    expect(state.isAuthChecked).toBe(true);
  });

  test('Тест состояния при логине пользователя (pending, fulfilled, rejected)', () => {
    let state = reducer(
      initialState,
      getLoginUser.pending('requestId', mockLoginData)
    );
    expect(state.loginUserRequest).toBe(true);
    expect(state.error).toBe(null);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(false);

    // Тест fulfilled
    state = reducer(
      state,
      getLoginUser.fulfilled(mockLoginResponse, 'requestId', mockLoginData)
    );
    expect(state.loginUserRequest).toBe(false);
    expect(state.error).toBe(null);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(true);

    const rejectedState = reducer(
      initialState,
      getLoginUser.rejected(new Error('error'), 'requestId', mockLoginData)
    );
    expect(rejectedState.loginUserRequest).toBe(false);
    expect(rejectedState.error).toBe('error');
    expect(rejectedState.isAuthChecked).toBe(false);
  });

  test('Тест состояния при получении данных пользователя (pending, fulfilled, rejected)', () => {
    let state = reducer(initialState, getUser.pending('requestId'));
    expect(state.request).toBe(true);
    expect(state.error).toBe(null);
    expect(state.isAuthChecked).toBe(false);
    expect(state.isAuthenticated).toBe(false);

    state = reducer(state, getUser.fulfilled(mockUserResponse, 'requestId'));
    expect(state.request).toBe(false);
    expect(state.error).toBe(null);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(true);

    const rejectedState = reducer(
      initialState,
      getUser.rejected(new Error('error'), 'requestId')
    );
    expect(rejectedState.request).toBe(false);
    expect(rejectedState.error).toBe(null); // Должен быть null, так как в редьюсере не устанавливается
    expect(rejectedState.isAuthChecked).toBe(true);
    expect(rejectedState.isAuthenticated).toBe(false);
    expect(rejectedState.user).toBe(null);
  });

  test('Тест состояния при обновлении данных пользователя (pending, fulfilled, rejected)', () => {
    const updatedUser = { name: 'Updated User', email: 'updated@example.com' };
    const mockUpdateResponse: TUserResponse = {
      success: true,
      user: updatedUser
    };

    let state = reducer(
      initialState,
      updateUser.pending('requestId', { name: 'Updated User' })
    );
    expect(state.request).toBe(true);
    expect(state.error).toBe(null);

    state = reducer(
      state,
      updateUser.fulfilled(mockUpdateResponse, 'requestId', {
        name: 'Updated User'
      })
    );
    expect(state.request).toBe(false);
    expect(state.error).toBe(null);
    expect(state.response).toEqual(updatedUser);
    expect(state.user).toEqual(updatedUser);

    state = reducer(
      state,
      updateUser.rejected(new Error('error'), 'requestId', {})
    );
    expect(state.request).toBe(false);
    expect(state.error).toBe('error');
  });

  test('Тест состояния при логауте пользователя (pending, fulfilled, rejected)', () => {
    const stateWithUser = {
      ...initialState,
      user: mockUser,
      isAuthenticated: true,
      isAuthChecked: true
    };

    let state = reducer(stateWithUser, getLogoutUser.pending('requestId'));
    expect(state.request).toBe(true);
    expect(state.error).toBe(null);
    expect(state.isAuthenticated).toBe(true);

    state = reducer(state, getLogoutUser.fulfilled(undefined, 'requestId'));
    expect(state.request).toBe(false);
    expect(state.error).toBe(null);
    expect(state.user).toBe(null);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.ordersState.data).toEqual([]);
    expect(state.userOrders).toEqual([]);

    const rejectedState = reducer(
      stateWithUser,
      getLogoutUser.rejected(new Error('error'), 'requestId')
    );
    expect(rejectedState.request).toBe(false);
    expect(rejectedState.error).toBe('error');
    expect(rejectedState.isAuthenticated).toBe(false);
    expect(rejectedState.user).toBe(null);
    expect(rejectedState.isAuthChecked).toBe(true);
  });

  test('Тест состояния при получении заказов (pending, fulfilled, rejected)', () => {
    let state = reducer(initialState, getOrders.pending('requestId'));
    expect(state.ordersState.loading).toBe(true);
    expect(state.ordersState.error).toBe(null);

    state = reducer(
      state,
      getOrders.fulfilled(mockOrdersResponse, 'requestId')
    );
    expect(state.ordersState.loading).toBe(false);
    expect(state.ordersState.error).toBe(null);
    expect(state.ordersState.data).toEqual(mockOrders);
    expect(state.userOrders).toEqual(mockOrders);

    state = reducer(state, getOrders.rejected(new Error('error'), 'requestId'));
    expect(state.ordersState.loading).toBe(false);
    expect(state.ordersState.error).toBe('error');
    expect(state.ordersState.data).toEqual([]);
    expect(state.userOrders).toEqual([]);
  });
});