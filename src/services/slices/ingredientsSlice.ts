import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

type IngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
  currentIngredient: TIngredient | null;
};

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null,
  currentIngredient: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      // getIngredientsApi возвращает TIngredient[]
      const ingredients = await getIngredientsApi();
      return ingredients;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Не удалось загрузить ингредиенты'
      );
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setCurrentIngredient: (
      state,
      action: PayloadAction<TIngredient | null>
    ) => {
      state.currentIngredient = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    getIngredients: (state) => state.items,
    getIngredientsLoading: (state) => state.isLoading,
    getIngredientsError: (state) => state.error,
    getCurrentIngredient: (state) => state.currentIngredient,
    getIngredientById: (state) => (id: string) =>
      state.items.find((ingredient) => ingredient._id === id)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setCurrentIngredient, clearError } = ingredientsSlice.actions;
export const {
  getIngredients,
  getIngredientsLoading,
  getIngredientsError,
  getCurrentIngredient,
  getIngredientById
} = ingredientsSlice.selectors;
export const ingredientsReducer = ingredientsSlice.reducer;
