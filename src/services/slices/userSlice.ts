import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export type AuthenticationState = {
  currentUser: TUser | null;
  isAuthenticationChecked: boolean;
};

const initialState: AuthenticationState = {
  currentUser: null,
  isAuthenticationChecked: false
};

export const registerUser = createAsyncThunk(
  'register/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue('Не удалось зарегистрировать пользователя');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: TLoginData) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const verifyUser = createAsyncThunk(
  'user/verifyUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .catch(() => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => dispatch(setAuthChecked(true)));
    } else {
      dispatch(setAuthChecked(true));
    }
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const userSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setAuthChecked: (
      state: AuthenticationState,
      action: PayloadAction<boolean>
    ) => {
      state.isAuthenticationChecked = action.payload;
    },
    setUser: (state: AuthenticationState, action: PayloadAction<TUser>) => {
      state.currentUser = action.payload;
    }
  },
  selectors: {
    getAuthChecked: (state: AuthenticationState): boolean =>
      state.isAuthenticationChecked,
    getUser: (state: AuthenticationState): TUser => state.currentUser!
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticationChecked = true;
        state.currentUser = action.payload;
      })
      .addCase(loginUser.pending, (state: AuthenticationState) => {
        state.isAuthenticationChecked = true;
      })
      .addCase(
        loginUser.fulfilled,
        (state: AuthenticationState, action: PayloadAction<TUser>) => {
          state.isAuthenticationChecked = true;
          state.currentUser = action.payload;
        }
      )
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isAuthenticationChecked = true;
        state.currentUser = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state: AuthenticationState) => {
        state.currentUser = null;
      });
  }
});

export const { getAuthChecked, getUser } = userSlice.selectors;
export const { setAuthChecked, setUser } = userSlice.actions;
export const userAuthReducer = userSlice.reducer;
