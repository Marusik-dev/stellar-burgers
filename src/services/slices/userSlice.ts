import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { RootState } from '../store';

export type UserState = {
  request: boolean;
  error: string | null;
  response: TUser | null;
  registerData: TRegisterData | null;
  user: TUser | null;
  userOrders: TOrder[];
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserRequest: boolean;
  ordersState: {
    loading: boolean;
    error: string | null;
    data: TOrder[];
  };
};

export const initialState: UserState = {
  request: false,
  error: null,
  response: null,
  registerData: null,
  user: null,
  userOrders: [],
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserRequest: false,
  ordersState: {
    loading: false,
    error: null,
    data: []
  }
};

export const getRegisterUser = createAsyncThunk(
  'users/register',
  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    if (!data.success) {
      return data;
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const getLoginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData) => {
    const data = await loginUserApi({ email, password });
    if (!data.success) {
      return data;
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const getUser = createAsyncThunk('users/getUser', getUserApi);

export const getOrders = createAsyncThunk('users/getOrders', getOrdersApi);

export const updateUser = createAsyncThunk('users/updateUser', updateUserApi);

export const getLogoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
    },
    resetError: (state) => {
      state.error = null;
    },
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },

    clearOrders: (state) => {
      state.ordersState.loading = false;
      state.ordersState.error = null;
      state.ordersState.data = [];
      state.userOrders = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getRegisterUser.pending, (state) => {
      state.request = true;
      state.error = null;
    });
    builder.addCase(getRegisterUser.rejected, (state, action) => {
      state.request = false;
      state.error = action.error.message as string;
      state.isAuthChecked = true;
    });
    builder.addCase(getRegisterUser.fulfilled, (state, action) => {
      state.request = false;
      state.error = null;
      state.response = action.payload.user;
      state.user = action.payload.user;
      state.isAuthChecked = true;
      state.isAuthenticated = true;
    });

    builder.addCase(getLoginUser.pending, (state) => {
      state.loginUserRequest = true;
      state.error = null;
    });
    builder.addCase(getLoginUser.rejected, (state, action) => {
      state.loginUserRequest = false;
      state.error = action.error.message as string;
    });
    builder.addCase(getLoginUser.fulfilled, (state, action) => {
      state.loginUserRequest = false;
      state.error = null;
      state.user = action.payload.user;
      state.isAuthChecked = true;
      state.isAuthenticated = true;
    });

    builder.addCase(getUser.pending, (state) => {
      state.request = true;
      state.error = null;
      state.isAuthChecked = false;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.request = false;
      state.isAuthChecked = true;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.request = false;
      state.error = null;
      state.user = action.payload.user;
      state.isAuthChecked = true;
      state.isAuthenticated = true;
    });

    builder.addCase(updateUser.pending, (state) => {
      state.request = true;
      state.error = null;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.request = false;
      state.error = action.error.message as string;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.request = false;
      state.error = null;
      state.response = action.payload.user;
      state.user = action.payload.user;
    });

    builder.addCase(getLogoutUser.pending, (state) => {
      state.request = true;
      state.error = null;
    });
    builder.addCase(getLogoutUser.rejected, (state, action) => {
      state.request = false;
      state.error = action.error.message as string;
      state.isAuthChecked = true;
      state.isAuthenticated = false;
      state.user = null;
    });
    builder.addCase(getLogoutUser.fulfilled, (state) => {
      state.request = false;
      state.error = null;
      state.user = null;
      state.isAuthChecked = true;
      state.isAuthenticated = false;
      state.ordersState.data = [];
      state.userOrders = [];
    });

    builder.addCase(getOrders.pending, (state) => {
      state.ordersState.loading = true;
      state.ordersState.error = null;
    });
    builder.addCase(getOrders.rejected, (state, action) => {
      state.ordersState.loading = false;
      state.ordersState.error = action.error.message as string;
      state.ordersState.data = [];
      state.userOrders = [];
    });
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.ordersState.loading = false;
      state.ordersState.error = null;
      state.ordersState.data = action.payload || [];
      state.userOrders = action.payload || []; // для обратной совместимости
    });
  }
});

export const { userLogout, resetError, setAuthChecked, clearOrders } =
  userSlice.actions;

export const getUserState = (state: RootState): UserState => state.user;

export const getOrdersState = (state: RootState) => state.user.ordersState;

export default userSlice.reducer;
