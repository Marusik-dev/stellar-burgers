import { rootReducer } from './store';
import ingredientReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices//orderSlice';
import feedReducer from './slices/feedSlice';
import userReducer from './slices/userSlice';

describe('rootReducer', () => {
  it('должен правильно инициализировать состояние', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState.ingredient).toEqual(
      ingredientReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.constructorItems).toEqual(
      constructorReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.order).toEqual(
      orderReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.feed).toEqual(
      feedReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.user).toEqual(
      userReducer(undefined, { type: '@@INIT' })
    );
  });
});