import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi, orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type OrderState = {
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  orderNumber: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  userOrders: [],
  currentOrder: null,
  orderNumber: null,
  isLoading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось загрузить заказы');
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientsIds: string[], { rejectWithValue }) => {
    try {
      const orderData = await orderBurgerApi(ingredientsIds);
      return orderData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось создать заказ');
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      return response.orders[0];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось найти заказ');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.orderNumber = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    setOrderNumber: (state, action: PayloadAction<number | null>) => {
      state.orderNumber = action.payload;
    }
  },
  selectors: {
    getUserOrders: (state) => state.userOrders,
    getCurrentOrder: (state) => state.currentOrder,
    getOrderNumber: (state) => state.orderNumber,
    getOrderLoading: (state) => state.isLoading,
    getOrderError: (state) => state.error,
    getUserOrderById: (state) => (id: string) =>
      state.userOrders.find((order) => order._id === id)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload.order.number;
        state.currentOrder = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentOrder, clearOrderError, setOrderNumber } =
  orderSlice.actions;

export const {
  getUserOrders,
  getCurrentOrder,
  getOrderNumber,
  getOrderLoading,
  getOrderError,
  getUserOrderById
} = orderSlice.selectors;

export const orderReducer = orderSlice.reducer;
